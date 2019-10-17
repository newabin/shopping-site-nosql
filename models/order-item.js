const Sequelize = require('sequelize')
const sequelize = require('../util/sqldb')

const OrderItem = sequelize.define('orderItem',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    quantity : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})


module.exports = OrderItem