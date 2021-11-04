import { Sequelize } from 'sequelize';

function createConnection() {
  let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host        : process.env.DB_HOST,
    port        : process.env.DB_PORT,
    dialect     : 'mysql',
    timezone    : '+09:00',
    dateStrings : true,
    define      : { timestamps: false },
    pool        : { max: 50, min: 0 }
  });

  return sequelize;
}

export const Utils = {
  createConnection
};
