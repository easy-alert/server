import cors from 'cors';

// CHANGE HERE
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://backoffice-easyalert-sandbox.s3-website-us-west-2.amazonaws.com'
];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
