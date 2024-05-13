/**
 * case controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::case.case');
export default factories.createCoreController('api::case.case', ({ strapi }) => ({
  async create(ctx) {
    // some logic here
    const response = await super.create(ctx);
    // some more logic
    console.log(ctx.state.user,response)
    return response;
  }
}));
