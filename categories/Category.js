const sequelize = require("sequelize");
const connection = require("../database/db");


const Category = connection.define('categories', {
    title:{
        type: sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: sequelize.STRING,
        allowNull:false

    }
})

Category.sync({force:false});




module.exports = Category;