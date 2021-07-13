var DataTypes = require("sequelize").DataTypes;
var _claim_docs = require("./claim_docs");

function initModels(sequelize) {
  var claim_docs = _claim_docs(sequelize, DataTypes);


  return {
    claim_docs
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
