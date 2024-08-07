import axios from 'axios';
import 'dotenv/config';

interface ISendErrorToServerLog {
  stack: any;
  extraInfo?: any;
}

export async function sendErrorToServerLog({ stack, extraInfo }: ISendErrorToServerLog) {
  const lowerCaseEnvironment = String(process.env?.ENVIRONMENT).toLowerCase();

  if (lowerCaseEnvironment.includes('sandbox') || lowerCaseEnvironment.includes('production')) {
    axios.post('https://ada-logs.herokuapp.com/api/errors/create', {
      projectName: 'Easy Alert',
      environment: process.env.ENVIRONMENT,
      side: 'Server',
      errorStack: JSON.stringify(stack),
      extraInfo,
    });
  }
}
