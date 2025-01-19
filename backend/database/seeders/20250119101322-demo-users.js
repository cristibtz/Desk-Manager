'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [
      {
        username: 'Alex',
        email: 'alex@app.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        username: 'John',
        email: 'john@app.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        username: 'Marc',
        email: 'marc@app.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete("Users", null, {});

  }
};
