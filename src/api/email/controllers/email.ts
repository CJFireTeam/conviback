export default {
  async sendPasswordEmail(ctx) {
    const { email, password } = ctx.request.body;
    
    // Validación básica
    if (!email || !password) {
      ctx.status = 400;
      return ctx.body = { 
        success: false, 
        message: "Faltan email o contraseña" 
      };
    }

    try {
      // Enviar usando plantilla
      const emailData = {
        to: email,
        subject: 'Tu Contraseña Temporal',
        template: 'contraseña temporal',
        'h:X-Mailgun-Variables': JSON.stringify({
          password: password,
          email: email,
          ip: ctx.request.ip,
          fecha: new Date().toLocaleString('es-CL', {
            timeZone: 'America/Santiago'
          })
        })
      };

      await strapi.plugins.email.services.email.send(emailData);

      // Registrar envío exitoso (opcional)
      strapi.log.info(`Email enviado a ${email}`);

      ctx.body = { success: true, message: "Correo enviado" };
    } catch (error) {
      // Registrar error detallado
      strapi.log.error('Error Mailgun', {
        error: error.message,
        email: email,
        stack: error.stack
      });
      
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Error en el servidor al enviar correo",
        userMessage: "No pudimos enviar el correo. Por favor intenta más tarde."
      };
    }
  },
};