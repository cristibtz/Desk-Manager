'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Rooms', [
      {
        room_number: '1',
        room_alias: 'Room A',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        room_number: '2',
        room_alias: 'Room B',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        room_number: '3',
        room_alias: 'Room C',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete("Rooms", null, {});

  }
};
