import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::meeting.meeting', ({ strapi }) => ({
  async create(ctx) {
    const { CreationDate, RoomName, RoomUrl, Establishment, CreatorUser, Courses, Users_destiny } = ctx.request.body;

    // Crear un nuevo registro
    const entity = await strapi.entityService.create('api::meeting.meeting', {
      data: {
        CreationDate,
        RoomName,
        RoomUrl,
        Establishment,
        CreatorUser,
        Courses,
        Users_destiny
      },
    });

    let usersToNotify = [];

    // Si se seleccionaron cursos, obtener los usuarios de esos cursos
    if (Courses && Courses.length > 0) {
      const usersFromCourses = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          courses: {
            id: { $in: Courses },
          },
          establishment: {
            id: Establishment,
          },
        },
        select: ['id', 'email', 'firstname', 'first_lastname'],
      });
      usersToNotify = [...usersToNotify, ...usersFromCourses];
    }

    // Si se seleccionaron usuarios específicos, agregarlos a la lista
    if (Users_destiny && Users_destiny.length > 0) {
      const specificUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          id: { $in: Users_destiny },
          establishment: {
            id: Establishment,
          },
        },
        select: ['id', 'email', 'firstname', 'first_lastname'],
      });
      usersToNotify = [...usersToNotify, ...specificUsers];
    }

    // Si no se seleccionaron ni cursos ni usuarios específicos, notificar a todos los usuarios del establecimiento
    if ((!Courses || Courses.length === 0) && (!Users_destiny || Users_destiny.length === 0)) {
      usersToNotify = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          establishment: {
            id: Establishment,
          },
        },
        select: ['id', 'email', 'firstname', 'first_lastname'],
      });
    }

    // Eliminar duplicados (en caso de que un usuario esté en múltiples cursos o sea seleccionado específicamente)
    usersToNotify = Array.from(new Set(usersToNotify.map(user => JSON.stringify(user)))).map(user => JSON.parse(user));

    // Enviar correo electrónico a los usuarios seleccionados
    for (const user of usersToNotify) {
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