/**
 * userform controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::userform.userform');
export default factories.createCoreController(
  "api::userform.userform",
  ({ strapi }) => ({
    /**
     * Example 1: Modifying a Strapi controller function
     *
     * If you need to modify the input or output of a pre-defined Strapi controller method,
     * write a method of the same name, and use `super` to call the parent method.
     * */
    async create(ctx) {
      // your custom logic for modifying the input
      ctx.request.body.data.date = new Date();
      ctx.request.body.data.createdBy = ctx.state.user.id;
      const userWithEstablishment = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, {
        populate: ['establishment'], // Aquí especificas la relación a popular
      });
      ctx.request.body.data.establishment = userWithEstablishment.establishment.id;
      // Call the default parent controller action
      const result = await super.create(ctx);

      // your custom logic for modifying the output
      result.meta.date = Date.now(); // change the date that is returned

      return result;
    }
  })
)
