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
          CreatorUser: true, // Población completa del creador
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
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { FirstNotice, LastNotice } = ctx.request.body;

    try {
      // Primero obtenemos la reunión existente
      const existingMeeting = await strapi.entityService.findOne('api::meeting.meeting', id, {
        populate: {
          Establishment: true,
          establishment_courses: true,
          Users_destiny: true,
        },
      });

      if (!existingMeeting) {
        ctx.throw(404, 'Meeting not found');
      }

      // Actualizamos los campos de notificación
      const entity = await strapi.entityService.update('api::meeting.meeting', id, {
        data: {
          FirstNotice,
          LastNotice,
        },
      });

      let usersToNotify = [];

      // Manejo de usuarios por cursos
      if (existingMeeting.establishment_courses && existingMeeting.establishment_courses.length > 0) {
        try {
          const usersFromCourses = await strapi.db.query('plugin::users-permissions.user').findMany({
            where: {
              establishment_courses: {
                id: { $in: existingMeeting.establishment_courses.map(course => course.id) },
              },
              $or: [
                { establishment: { id: existingMeeting.Establishment?.id } },
                { establishment_authenticateds: { id: existingMeeting.Establishment?.id } }
              ],
            },
            select: ['id', 'email', 'firstname', 'first_lastname'],
          });
          if (usersFromCourses && usersFromCourses.length > 0) {
            usersToNotify = [...usersToNotify, ...usersFromCourses];
          }
        } catch (error) {
          console.log('Error al obtener usuarios de cursos:', error);
          // Continuamos con la ejecución aunque no se encuentren usuarios en los cursos
        }
      }

      // Manejo de usuarios específicos
      if (existingMeeting.Users_destiny && existingMeeting.Users_destiny.length > 0) {
        try {
          const specificUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
            where: {
              id: { $in: existingMeeting.Users_destiny.map(user => user.id) },
              $or: [
                { establishment: { id: existingMeeting.Establishment?.id } },
                { establishment_authenticateds: { id: existingMeeting.Establishment?.id } }
              ],
            },
            select: ['id', 'email', 'firstname', 'first_lastname'],
          });
          if (specificUsers && specificUsers.length > 0) {
            usersToNotify = [...usersToNotify, ...specificUsers];
          }
        } catch (error) {
          console.log('Error al obtener usuarios específicos:', error);
          // Continuamos con la ejecución aunque no se encuentren usuarios específicos
        }
      }

      // Si no hay usuarios específicos ni de cursos, notificar a todos los usuarios del establecimiento
      if (usersToNotify.length === 0 && existingMeeting.Establishment) {
        try {
          const allUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
            where: {
              $or: [
                { establishment: { id: existingMeeting.Establishment.id } },
                { establishment_authenticateds: { id: existingMeeting.Establishment.id } }
              ],
            },
            select: ['id', 'email', 'firstname', 'first_lastname'],
          });
          if (allUsers && allUsers.length > 0) {
            usersToNotify = allUsers;
          }
        } catch (error) {
          console.log('Error al obtener todos los usuarios:', error);
        }
      }

      // Eliminar duplicados
      usersToNotify = Array.from(new Set(usersToNotify.map(user => JSON.stringify(user)))).map(user => JSON.parse(user));

      // Determinar el tipo de notificación
      const notificationType = FirstNotice ? 'primera' : LastNotice ? 'última' : '';

      // Enviar correos solo si hay usuarios para notificar
      if (usersToNotify.length > 0) {
        for (const user of usersToNotify) {
          try {
            await strapi.plugin('email').service('email').send({
              to: user.email,
              subject: `Recordatorio de reunión - ${notificationType} notificación`,
              html: `
                <p><strong>Hola ${user.firstname} ${user.first_lastname},</strong></p>
                <p>Esta es la ${notificationType} notificación para la reunión "${existingMeeting.RoomName}".</p>
                <p>Puede ingresar a la reunión a través del siguiente link: <a href="${existingMeeting.RoomUrl}">${existingMeeting.RoomUrl}</a></p>
                <p>Nombre de la sala: ${existingMeeting.RoomName}</p>
                <p>Fecha de la reunión: ${existingMeeting.MeetingDate || 'No especificada'}</p>
                <p>Hora de la reunión: ${existingMeeting.MeetingTime || 'No especificada'}</p>
              `,
            });
          } catch (error) {
            console.log(`Error al enviar email a ${user.email}:`, error);
            // Continuamos con el siguiente usuario si hay error en el envío
          }
        }
      }

      return entity;
    } catch (error) {
      console.error('Error en update:', error);
      ctx.throw(500, error.message);
    }
  }

}));