export default {
  async sendPasswordEmail(ctx) {
    const { email, password } = ctx.request.body;

    try {
      await strapi.plugins.email.services.email.send({
        to: email,
        subject: 'Tu Contraseña Temporal',
        html: `
          <p><strong>Estimado/a,</strong></p>
          <p>Le informamos que su contraseña temporal es: <strong>${password}</strong></p>
          <p>Por favor, asegúrese de haber autenticado su cuenta antes de iniciar sesión.</p>
          <p>Le recomendamos cambiar su contraseña a través de su perfil tras su primer inicio de sesión para garantizar una mayor seguridad.</p>
          <p>Atentamente,</p>
          <p>El equipo de soporte.</p>
        `,
      });

      ctx.body = { success: true, message: "Correo enviado exitosamente" };
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      ctx.status = 500;
      ctx.body = { success: false, message: "Error al enviar el correo" };
    }
  },
};