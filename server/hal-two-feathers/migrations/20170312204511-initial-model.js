'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      queryInterface.showAllTables().then(function(tableNames) {
        console.log(tableNames.toString());
      })
     queryInterface.bulkInsert('rooms',[{
      id: 1,
      name: 'test room 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'test room 2',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    queryInterface.bulkInsert('devices',[{
      id: 1,
      name: 'test device 1',
      state: 0,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 2,
      name: 'test device 2',
      state: 0,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 3,
      name: 'test device 3',
      state: 0,
      roomId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 4,
      name: 'test device 4',
      state: 0,
      roomId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};