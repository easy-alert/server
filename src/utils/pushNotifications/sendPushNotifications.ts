import axios from 'axios';

type SendNotificationParams = {
  to: string[];
  title: string;
  body: string;
};

export async function sendPushNotification({ to, title, body }: SendNotificationParams) {
  const url = 'https://exp.host/--/api/v2/push/send';

  const headers = {
    host: 'exp.host',
    accept: 'application/json',
    'accept-encoding': 'gzip, deflate',
    'content-type': 'application/json',
  };

  const payload = {
    to,
    title,
    body,
    sound: 'default',
  };

  const response = await axios.post(url, payload, {
    headers,
  });

  return response.data;
}

// Example usage:
// sendNotification({
//   to: ["ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"],
//   title: "Hello!",
//   body: "This is a test notification.",
// })
