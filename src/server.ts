/* eslint-disable no-console */
import { App } from './app';

new App().server.listen(process.env.PORT || 8080, () =>
  console.log(
    '\n\n\n 😎 Server is running 😎 \n\n',
    '📝 http://localhost:8080/api/backoffice/docs \n',
    '📝 http://localhost:8080/api/company/docs\n',
    '📝 http://localhost:8080/api/client/docs \n',
    '📝 http://localhost:8080/api/integration/docs \n\n',
  ),
);
