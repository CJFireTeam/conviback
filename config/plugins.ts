module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_APIKEY'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'cesar.laraperalta@gmail.com',
        defaultReplyTo: 'cesar.laraperalta@gmail.com',
      },
    },
  },
  // ...
});
