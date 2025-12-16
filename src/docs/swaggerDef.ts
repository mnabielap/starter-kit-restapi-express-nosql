import { config } from '../config/config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Express API Starter Kit',
    version: '1.0.0',
    description: 'A full-featured REST API starter kit built with Express, MongoDB, and Zod.',
    license: {
      name: 'MIT',
      url: 'https://github.com/mnabielap/starter-kit-restapi-express-nosql/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Local Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          is_email_verified: { type: 'boolean' },
        },
        example: {
          id: '5ebac534954b54139806c112',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          is_email_verified: false,
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          access: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              expires: { type: 'string', format: 'date-time' },
            },
          },
          refresh: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              expires: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

export default swaggerDef;