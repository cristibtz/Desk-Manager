'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reservations', [
      {
        user_id: "a",
        room_id: 1,
        desk_id: 1,
        start_date: new Date("2025-02-19 10:00:00.000+00"),
        end_date: new Date("2025-02-19 12:00:00.000+00"),
        note: "Work on project",
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        user_id: "a",
        room_id: 1,
        desk_id: 2,
        start_date: new Date("2025-02-19 14:00:00.000+00"),
        end_date: new Date("2025-02-19 16:00:00.000+00"),
        note: "Work on project",
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        user_id: "ab",
        room_id: 2,
        desk_id: 4,
        start_date: new Date("2025-02-19 11:00:00.000+00"),
        end_date: new Date("2025-02-19 12:00:00.000+00"),
        note: "Browse the web",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: "ab",
        room_id: 2,
        desk_id: 5,
        start_date: new Date("2025-02-19 14:00:00.000+00"),
        end_date: new Date("2025-02-19 15:00:00.000+00"),
        note: "Browse the web",
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        user_id: "abc",
        room_id: 3,
        desk_id: 7,
        start_date: new Date("2025-02-19 08:00:00.000+00"),
        end_date: "2025-02-19 10:00:00.000+00",
        note: "Coffe and mails",
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        user_id: "abc",
        room_id: 3,
        desk_id: 8,
        start_date: new Date("2025-02-19 14:00:00.000+00"),
        end_date: new Date("2025-02-19 16:00:00.000+00"),
        note: "Coffe and mails",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete("Reservations", null, {});

  }
};
