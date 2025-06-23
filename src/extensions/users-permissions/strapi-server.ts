import crypto from "crypto";
import FormData from "form-data";
import Mailgun from "mailgun.js";
const utils = require("@strapi/utils");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

// Definir interfaces más completas
interface AdvancedSettings {
  allow_register?: boolean;
  email_reset_password?: string;
  [key: string]: any;
}

interface User {
  id: number;
  email: string;
  username?: string;
  blocked: boolean;
  confirmed: boolean;
  confirmationToken?: string;
  password?: string;
  [key: string]: any;
}

interface RegisterParams {
  email: string;
  password: string;
  username?: string;
  [key: string]: any;
}

interface Context {
  request: {
    body: RegisterParams & { confirmation?: string };
  };
  query?: {
    [key: string]: any;
  };
  state: {
    auth?: any;
  };
  send: (data: any) => void;
  redirect: (url: string) => void;
}

interface PluginStore {
  get: (options: { key: string }) => Promise<AdvancedSettings>;
}

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUser = (user: User, ctx: Context) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getService = (name: string) => {
  return strapi.plugin("users-permissions").service(name);
};

// Configurar Mailgun
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY as string,
  url: process.env.MAILGUN_URL || "https://api.mailgun.net",
});

export default (plugin: any) => {
  plugin.controllers.auth.forgotPassword = async (ctx: Context) => {
    let { email } = ctx.request.body;

    // Validar email
    const isEmail = emailRegExp.test(email);
    if (isEmail) {
      email = email.toLowerCase();
    } else {
      throw new ValidationError("Por favor ingresa un email válido");
    }

    const pluginStore: PluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    // Buscar usuario por email
    const user: User | null = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: email.toLowerCase() } });

    // Validaciones del usuario
    if (!user) {
      throw new ApplicationError("Este email no existe");
    }

    if (user.blocked) {
      throw new ApplicationError("Este usuario está deshabilitado");
    }

    // Generar token de recuperación
    const resetPasswordToken = crypto.randomBytes(64).toString("hex");

    // Obtener configuración avanzada para la URL
    const advanced = await pluginStore.get({
      key: "advanced",
    });

    const userInfo = await sanitizeUser(user, ctx);

    // Construir URL de reset
    const resetUrl = `${advanced.email_reset_password}?code=${resetPasswordToken}`;

    try {
      // Enviar email usando Mailgun con template
      await mg.messages.create(
        process.env.MAILGUN_DOMAIN as string,
        {
          from: `CONVI <postmaster@${process.env.MAILGUN_DOMAIN}>`,
          to: [email],
          subject: "Recuperación de Contraseña - CONVI",
          template: "recuperacion_contrasena",
          "h:X-Mailgun-Variables": JSON.stringify({
            nombre: userInfo.username || user.email.split('@')[0],
            reset_url: resetUrl,
            expiracion: "24 horas",
          }),
        }
      );

      strapi.log.info(`Email de recuperación enviado a: ${email}`);
    } catch (error) {
      strapi.log.error("Error al enviar email con Mailgun:", error);
      throw new ApplicationError("Error enviando email de recuperación");
    }

    // Actualizar usuario con el token
    await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: { resetPasswordToken },
    });

    ctx.send({ ok: true });
  };
  
  // Controlador de registro modificado
plugin.controllers.auth.register = async (ctx: Context) => {
  const pluginStore: PluginStore = await strapi.store({
    type: "plugin",
    name: "users-permissions",
  });

  const settings: AdvancedSettings = await pluginStore.get({
    key: "advanced",
  });

  if (!settings.allow_register) {
    throw new ApplicationError("El registro no está permitido");
  }

  const params: RegisterParams = {
    ...ctx.request.body,
    provider: "local",
  };

  if (!params.password) {
    throw new ValidationError("La contraseña es requerida");
  }

  const existingUser: User | null = await strapi
    .query("plugin::users-permissions.user")
    .findOne({ where: { email: params.email.toLowerCase() } });

  if (existingUser) {
    throw new ApplicationError("El email ya está registrado");
  }

  // ✅ 1. OBTENER EL ROL "Authenticated"
  const authenticatedRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "authenticated" } });

  if (!authenticatedRole) {
    throw new ApplicationError("No se encontró el rol 'Authenticated'");
  }

  // ✅ 2. USAR SERVICIO DE USUARIOS CON ROL ASIGNADO
  const userService = getService("user");
  const newUser = await userService.add({
    ...params,
    confirmed: false,
    role: authenticatedRole.id  // ASIGNAR ROL AQUÍ
  });

  // Generar token de confirmación
  const confirmationToken = crypto.randomBytes(20).toString("hex");
  
  // Actualizar usuario con token
  await strapi.query("plugin::users-permissions.user").update({
    where: { id: newUser.id },
    data: { confirmationToken },
  });

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:1337';
  const confirmationUrl = `${backendUrl}/api/auth/email-confirmation?confirmation=${confirmationToken}`;
  
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN as string, {
      from: `CONVI <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: newUser.email,
      subject: "Confirma tu cuenta en CONVI",
      template: "confirmacion_registro",
      "h:X-Mailgun-Variables": JSON.stringify({
        confirmation_url: confirmationUrl,
        user_name: newUser.username || newUser.email.split("@")[0],
      }),
    });

    strapi.log.info(`Correo de confirmación enviado a: ${newUser.email}`);
  } catch (error) {
    strapi.log.error("Error al enviar correo de confirmación:", error);
    throw new ApplicationError("Error al enviar el correo de confirmación");
  }

  const jwt = getService("jwt").issue({
    id: newUser.id,
  });

  const userInfo = sanitizeUser(newUser, ctx);

  // ✅ LIMPIAR DATOS SENSIBLES ANTES DE ENVIAR
  delete userInfo.password;
  delete userInfo.resetPasswordToken;
  delete userInfo.confirmationToken;

  ctx.send({
    jwt,
    user: userInfo,
  });
};

  // Sobrescribir el controlador de confirmación de email
plugin.controllers.auth.emailConfirmation = async (ctx: Context) => {
  const confirmation = ctx.query.confirmation;
  
  if (!confirmation) {
    throw new ValidationError("Token de confirmación requerido");
  }

  // Buscar usuario por token
  const user: User | null = await strapi
    .query("plugin::users-permissions.user")
    .findOne({ where: { confirmationToken: confirmation } });

  if (!user) {
    throw new ApplicationError("Token de confirmación inválido");
  }

  if (user.confirmed) {
    throw new ApplicationError("La cuenta ya está confirmada");
  }

  if (user.blocked) {
    throw new ApplicationError("El usuario está bloqueado");
  }

  // ✅ ACTUALIZACIÓN DIRECTA (EVITA EL PROBLEMA DE CONTRASEÑA)
  await strapi.query("plugin::users-permissions.user").update({
    where: { id: user.id },
    data: { 
      confirmed: true,
      confirmationToken: null
    }
  });

  // Redirigir al frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  ctx.redirect(`${frontendUrl}/login?confirmed=true`);
};

  return plugin;
};