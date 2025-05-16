const sequelize = require("sequelize");
const connection = require("../database/db");
const Category = require("../categories/Category");

const Report = connection.define("Reports", {
    title:{
        type: sequelize.STRING,
        allowNull:false
    },slug:{
        type: sequelize.STRING,
        allowNull:false
    },
    body:{
        type: sequelize.TEXT,
        allowNull:false
    },
    location:{
        type: sequelize.STRING,
        allowNull:false
    }
    
})


Category.hasMany(Report); 
Report.belongsTo(Category);

Report.sync({force:false});




module.exports = Report;