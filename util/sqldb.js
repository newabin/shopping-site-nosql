const Sequelize = require('sequelize')

//type password instead of ********
const sequelize = new Sequelize('node-complete', 'root', '********', {dialect: 'mysql', host: 'localhost'})

module.exports = sequelize