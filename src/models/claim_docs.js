const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('claim_docs', {
    claimSerno : {
      autoIncrement : true,
      type          : DataTypes.INTEGER,
      allowNull     : false,
      primaryKey    : true
    },
    didID : {
      type      : DataTypes.STRING(100),
      allowNull : true
    },
    claims : {
      type      : DataTypes.JSON,
      allowNull : true
    },
    createYHS : {
      type         : DataTypes.DATE,
      allowNull    : false,
      defaultValue : Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateYHS : {
      type         : DataTypes.DATE,
      allowNull    : false,
      defaultValue : Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName  : 'claim_docs',
    timestamps : false,
    indexes    : [
      {
        name   : "PRIMARY",
        unique : true,
        using  : "BTREE",
        fields : [
          { name: "claimSerno" }
        ]
      },
      {
        name   : "claim_idx",
        using  : "BTREE",
        fields : [
          { name: "didID" }
        ]
      }
    ]
  });
};
