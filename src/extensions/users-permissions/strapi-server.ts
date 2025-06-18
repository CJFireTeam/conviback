import crypto from "crypto";
import FormData from "form-data";
import Mailgun from "mailgun.js";
const utils = require("@strapi/utils");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

interface User {
  id: number;
  email: string;
  username?: string;
  blocked: boolean;
}

interface Context {
  request: {
    body: {
      email: string;
    };
  };
  state: {
    auth?: any;
  };
  send: (data: any) => void;
}

interface PluginStore {
  get: (options: { key: string }) => Promise<any>;
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
  url: process.env.MAILGUN_URL || "https://api.mailgun.net" // Para EU usar: https://api.eu.mailgun.net
});

export default (plugin: any) => {
  plugin.controllers.auth.forgotPassword = async (ctx: Context) => {
    let { email } = ctx.request.body;

    // Validar email
    const isEmail = emailRegExp.test(email);
    if (isEmail) {
      email = email.toLowerCase();
    } else {
      throw new ValidationError("Please provide a valid email address");
    }

    const pluginStore: PluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    // Buscar usuario por email
    const user: User = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: email.toLowerCase() } });

    // Validaciones del usuario
    if (!user) {
      throw new ApplicationError("Este email no existe");
    }

    if (user.blocked) {
      throw new ApplicationError("Este usuario esta deshabilitado");
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
      const mailgunResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN as string, {
        from: `CONVI <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Recuperación de Contraseña - CONVI",
        template: "recuperacion_contrasena", // Nombre de tu template en Mailgun
        "h:X-Mailgun-Variables": JSON.stringify({
          nombre: userInfo.username || userInfo.email,
          reset_url: resetUrl,
          expiracion: "24 horas"
        }),
      });

      console.log(`Email de recuperación enviado a: ${email}`, mailgunResponse);
    } catch (error) {
      console.error("Error al enviar email con Mailgun:", error);
      throw new ApplicationError("Error sending recovery email");
    }

    // Actualizar usuario con el token (esto es importante para que Strapi maneje el reset)
    await strapi
      .query("plugin::users-permissions.user")
      .update({ 
        where: { id: user.id }, 
        data: { resetPasswordToken } 
      });

    ctx.send({ ok: true });
  };

  return plugin;
};