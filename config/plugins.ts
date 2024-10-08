module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        secure: true,
        host: env('SMTP_HOST', 'mail.codevsoft.cl'),
        port: env('SMTP_PORT', 465),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_APIKEY'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'contacto@codevsoft.cl',
        defaultReplyTo: 'contacto@codevsoft.cl',
      },
    },
  },
  // ...
});
