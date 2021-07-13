import { Sequelize } from 'sequelize';

function createConnection() {
  let sequelize = new Sequelize('did', 'mysql_id', 'mysql_pass', {
    host        : 'mysql_host',
    port        : 3306,
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
