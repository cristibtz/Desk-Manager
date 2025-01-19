'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Desks', [
      {
        desk_number: 1,
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 2,
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 3,
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        desk_number: 1,
        room_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 2,
        room_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 3,
        room_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        desk_number: 1,
        room_id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 2,
        room_id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        desk_number: 3,
        room_id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete("Desks", null, {});

  }
};
