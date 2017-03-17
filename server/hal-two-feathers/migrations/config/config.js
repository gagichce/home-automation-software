const app = require('../../src/app');
const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: {
    storage: app.get('sqlite'),
    dialect: 'sqlite',
    migrationStorageTableName: '_migrations'
  }
};