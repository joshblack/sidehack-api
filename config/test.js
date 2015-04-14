require('dotenv').load();
import adapters from './adapters';
import defaults from './defaults';

const connections = {
  mysql: {
    adapter: 'mysql',
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    charset: 'utf8'
  }
};

export default { adapters, connections, defaults };
