import { factories } from '@strapi/strapi';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

export default factories.createCoreController('api::case.case', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    
    // Crear la denuncia
    const response = await super.create(ctx);
    
    // Configurar Mailgun
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
      url: process.env.MAILGUN_URL || 'https://api.mailgun.net',
    });
    
    // Obtener fecha actual formateada
    const now = new Date();
    const fechaRegistro = now.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    // Variables para el template
    const templateData = {
      nombre: `${user.firstname} ${user.first_lastname}`,
      denuncia_id: `CONVI-${response.data.id.toString().padStart(6, '0')}`,
      fecha_registro: fechaRegistro,
      url_denuncia: 'https://convifrontdev.vercel.app/login'
    };
    
    try {
      // Enviar email con Mailgun usando template
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.MAILGUN_FROM || 'CONVI <soporte@codevsoft.cl>',
        to: user.email,
        subject: 'Confirmación de Denuncia Registrada',
        template: 'confirmacion_denuncia',
        'h:X-Mailgun-Variables': JSON.stringify(templateData),
      });
    } catch (error) {
      strapi.log.error('Error al enviar correo de confirmación de denuncia:', error);
    }
    
    return response;
  }
}));