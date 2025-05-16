const express = require('express');
const connection = require('./database/db');
const bodyParser = require('body-parser');
const CategoriesController = require("./categories/CategoriesController");
const ReportsController = require("./Reports/ReportsController");
const UserController = require("./users/UserController");
const Category = require("./categories/Category");
const Report = require("./Reports/Report");
const User = require("./users/User");
const session = require("express-session");


const app = express();


//config view engine e arquivos estáticos
app.set("view engine", "ejs");
app.use(express.static("public"));

//configuração das sessões

app.use(session({
    secret:"uguturhqwndpqowijdh", // o secret é como se fosse o salt do crypt
    cookie: {
        maxAge: 7200000 //o tempo para destruir os cookies automaticamente 30000 milisegundos
    }

}))

//config bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate().then(()=>{
    console.log("Database acessed")
}).catch((err)=>{
    console.log("err: " + err);
})
//autenticando o banco de dados

app.use("/", CategoriesController);
app.use("/", ReportsController);
app.use("/", UserController);
//quer dizer que app está usando as rotas que estão dentro de categoriesController e ReportsController


app.get("/session", (req,res)=>{

});

app.get("/read", (req,res)=>{
    
});

app.get('/', (req,res)=>{
    Report.findAll({
        include: [{model:Category}],
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(Reports=>{
        Category.findAll().then(categories=>{
            res.render("index", {Reports:Reports, categories:categories})
        })
        
    })
    
})

app.get('/:slug', (req,res)=>{
    var slug = req.params.slug;
    Report.findOne({
        include: [{model:Category}],
        where : {slug:slug}
    }).then(Reports=>{
        if(Reports!=undefined ){
            Category.findAll().then(categories=>{
                res.render("Report", {Reports:Reports, categories:categories})
            })
        }else{
            res.redirect("/");
        }
    })
})

app.get('/categories/:slug', (req,res)=>{
    var slug = req.params.slug;
    Category.findAll().then(categories=>{
        Category.findOne({
            where: {slug:slug}
        }).then(categorie=>{
            Report.findAll({
                include: {model:Category},
                where: {categoryId:categorie.id}
            }).then(Reports =>{
                res.render("admin/categories/Reports", {Reports:Reports, categorie:categorie, categories:categories})
            })
        })
    })
    
})

app.listen(8080, ()=>{
    console.log("Server running!")
})