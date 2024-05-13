/**
 * case controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::case.case');
export default factories.createCoreController('api::case.case', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request
    const response = await super.create(ctx);
    const url =strapi.config.get('server.url', 'defaultValueIfUndefined')
    await strapi.plugin('email').service('email').send({
      to: user.email,
      subject: 'Nueva Denuncia generada',
      html: `<p><strong>Hola ${user.firstname} ${user.first_lastname},</strong></p>
      <p>Su nueva denuncia ha sido registrada.</p>
      <p>Puede ver su registro en nuestra aplicación <a href=${url}>aquí</a>.</p>`,
    });
    return response;
  }
}));
