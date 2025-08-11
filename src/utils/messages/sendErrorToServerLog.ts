import axios from 'axios';
import 'dotenv/config';

interface ISendErrorToServerLog {
  stack: any;
  extraInfo?: any;
}

export async function sendErrorToServerLog({ stack, extraInfo }: ISendErrorToServerLog) {
  const environment = String(process.env?.ENVIRONMENT) || String(process.env?.ENV);
  const environmentLowerCase = environment.toLowerCase();

  if (environmentLowerCase.includes('sandbox') || environmentLowerCase.includes('production')) {
    axios.post('https://ada-logs.herokuapp.com/api/easy-alert/errors/create', {
      projectName: 'Easy Alert',
      environment,
      side: 'Server',
      errorStack: JSON.stringify(stack),
      extraInfo,
    });
  }
}
