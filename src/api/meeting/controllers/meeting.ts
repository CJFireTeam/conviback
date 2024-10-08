import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::meeting.meeting', ({ strapi }) => ({
  async create(ctx) {
    const { CreationDate, RoomName, RoomUrl, Establishment, CreatorUser } = ctx.request.body;

    // Crear un nuevo registro
    const entity = await strapi.entityService.create('api::meeting.meeting', {
      data: {
        CreationDate,
        RoomName,
        RoomUrl,
        Establishment,
        CreatorUser,
      },
    });


    // Obtener todos los usuarios asociados con el ID del Establishment
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      where: {
        establishment: {
          id: Establishment,
        },
      },
      select: ['email', 'firstname', 'first_lastname'],
    });

    // Enviar correo electrónico a todos los usuarios
    for (const user of users) {
      try {
        await strapi.plugin('email').service('email').send({
          to: user.email,
          subject: 'Nueva reunión generada',
          html: `
            <p><strong>Hola ${user.firstname} ${user.first_lastname},</strong></p>
            <p>Una nueva reunión ha sido registrada para su establecimiento.</p>
            <p>Puede ingresar a la reunión a través del siguiente link: <a href="${RoomUrl}">${RoomUrl}</a></p>
            <p>Nombre de la sala: ${RoomName}</p>
            <p>Fecha: ${CreationDate}</p>
          `,
        });
      } catch (error) {
        console.log(error)
      }
    }
    return entity;
  }
}));