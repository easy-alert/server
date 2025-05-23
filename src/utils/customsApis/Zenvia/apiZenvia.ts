import axios from 'axios';

export const ApiZenvia = axios.create({
  baseURL: 'https://api.zenvia.com',
  headers: {
    'Access-Control-Allow-Origin': '*',
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Accept-Encondig': 'gzip, deflate, br',
    'X-API-TOKEN': process.env.TOKEN_ZENVIA!,
  },
});
