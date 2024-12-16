import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::meeting.meeting', ({ strapi }) => ({
  async create(ctx) {
    const { CreationDate, RoomName, RoomUrl, Establishment, CreatorUser, establishment_courses, Users_destiny, MeetingDate, MeetingTime } = ctx.request.body;

    // Crear un nuevo registro
    const entity = await strapi.entityService.create('api::meeting.meeting', {
      data: {
        CreationDate,
        RoomName,
        RoomUrl,
        Establishment,
        CreatorUser,
        establishment_courses,
        Users_destiny,
        MeetingDate,
        MeetingTime
      },
    });

    let usersToNotify = [];

    // Si se seleccionaron cursos, obtener los usuarios de esos cursos
    if (establishment_courses && establishment_courses.length > 0 /* && (!Users_destiny || Users_destiny.length === 0) */) {
      const usersFromCourses = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          establishment_courses: {
            id: { $in: establishment_courses },
          },
          $or: [
            { establishment: { id: Establishment } },
            { establishment_authenticateds: { id: Establishment } }
          ],
        },
        select: ['id', 'email', 'firstname', 'first_lastname'],
      });
      usersToNotify = [...usersToNotify, ...usersFromCourses];
    }

    // Si se seleccionaron usuarios específicos, agregarlos a la lista
    if (Users_destiny && Users_destiny.length > 0 /* && (!establishment_courses && establishment_courses.length === 0) */) {
      const specificUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          id: { $in: Users_destiny },
          $or: [
            { establishment: { id: Establishment } },
            { establishment_authenticateds: { id: Establishment } }
          ],
        },
        select: ['id', 'email', 'firstname', 'first_lastname'],
      });
      usersToNotify = [...usersToNotify, ...specificUsers];
    }

    // Si no se seleccionaron ni cursos ni usuarios específicos, notificar a todos los usuarios del establecimiento
    if ((!establishment_courses || establishment_courses.length === 0) && (!Users_destiny || Users_destiny.length === 0)) {
      usersToNotify = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          $or: [
            { establishment: { id: Establishment } },
            { establishment_authenticateds: { id: Establishment } }
          ],
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
            <p>Fecha de la reunión: ${MeetingDate || 'No especificada'}</p>
            <p>Hora de la reunión: ${MeetingTime || 'No especificada'}</p>
          `,
        });
      } catch (error) {
        console.log(error)
      }
    }
    return entity;
  },
  async find(ctx) {
    try {
      const { results, pagination } = await strapi.entityService.findPage('api::meeting.meeting', {
        filters: ctx.query.filters || {},
        sort: ctx.query.sort || [],
        pagination: ctx.query.pagination || { page: 1, pageSize: 10 },
        populate: {
          Establishment: true, // Población completa del establecimiento
          CreatorUser:  true, // Población completa del creador
          Users_destiny: true, // Población completa de los usuarios de destino
          establishment_courses: true, // Población completa de los cursos
        },
      });
  
      if (!results || results.length === 0) {
        console.log('No se encontraron reuniones');
        return {
          data: [],
          meta: { pagination, message: 'No se encontraron reuniones' }
        };
      }
  
      return {
        data: results,
        meta: { pagination }
      };
    } catch (error) {
      console.error('Error en el método find:', error);
      ctx.body = { error: error.message };
      ctx.status = 500;
    }
  }

}));