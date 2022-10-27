/* eslint-disable no-console */
import { App } from './app';

//test
new App().server.listen(process.env.PORT || 8080, () =>
  console.log(
    '\n\n\n 😎 Server is running 😎 \n\n',
    '📝 http://localhost:8080/api/backoffice/docs \n',
    '📝 http://localhost:8080/api/company/docs\n\n',
  ),
);
