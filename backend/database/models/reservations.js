'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservations.belongsTo(models.Users);
      models.Users.hasMany(Reservations);

      Reservations.belongsTo(models.Rooms);
      models.Rooms.hasMany(Reservations);

      Reservations.belongsTo(models.Desks);
      models.Desks.hasMany(Reservations);
    }
  }
  Reservations.init({
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    desk_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reservations',
  });
  return Reservations;
};