import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import history from 'connect-history-api-fallback';
import path from 'path';

const app = express();

const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV, process.env.HOST, process.env.PORT);

const host = process.env.HOST;
const port = Number(process.env.PORT);

app
  .use(helmet())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true,
  }))
  .use(cookieParser())
  .use(
    history({
      verbose: false, // true 開啟活動日誌
    }),
  );


if (!isDev) {

  app.use(express.static(path.join(__dirname, '../dist')));

  app.listen(port, host, () => {
    console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console
  });
}


export default app;
