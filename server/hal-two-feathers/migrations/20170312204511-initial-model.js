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
      id: 16,
      name: 'test device 1',
      state: 0,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 17,
      name: 'test device 2',
      state: 0,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 32,
      name: 'test device 3',
      state: 0,
      roomId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 33,
      name: 'test device 4',
      state: 0,
      roomId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    queryInterface.bulkInsert('patterns',[{
      id: 1,
      deviceId: 16,
      pattern_text: "Every Monday at 1:15pm",
      pattern_rule: "iCAL FORMAT THIS IS TEST",
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      deviceId: 17,
      pattern_text: "Every Tuesday at 6:15pm",
      pattern_rule: "iCAL FORMAT THIS IS TEST",
      status: 1,
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