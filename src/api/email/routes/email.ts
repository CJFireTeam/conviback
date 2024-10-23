export default {
    routes: [
      {
        method: 'POST',
        path: '/send-password-email',
        handler: 'email.sendPasswordEmail',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };