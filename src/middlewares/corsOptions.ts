import cors from 'cors';

// CHANGE HERE
const allowedOrigins = [
  'https://backoffice.easyalert.com.br',
  'https://company.easyalert.com.br',
  'https://public.easyalert.com.br',
  'https://sandbox.backoffice.easyalert.com.br',
  'https://sandbox.company.easyalert.com.br',
  'https://sandbox.public.easyalert.com.br',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://client.easyalert.com.br',
  'https://app.easyalert.com.br',
  'https://easyalert-sandbox.herokuapp.com',
  'https://easyalert-production.herokuapp.com',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export { corsOptions };
