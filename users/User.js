const sequelize = require("sequelize");
const connection = require("../database/db");


const User = connection.define('users', {
    email:{
        type: sequelize.STRING,
        allowNull:false
    },
    password:{
        type: sequelize.STRING,
        allowNull:false
    },
    cep:{
        type: sequelize.STRING,
        allowNull:false
    },
    logradouro:{
        type: sequelize.STRING,
        allowNull:false
    },
    bairro:{
        type: sequelize.STRING,
        allowNull:false
    },
    cidade:{
        type: sequelize.STRING,
        allowNull:false
    },
    estado:{
        type: sequelize.STRING,
        allowNull:false
    }

})

User.sync({force:false});

module.exports = User;