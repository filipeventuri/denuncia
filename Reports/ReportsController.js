const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Report = require("./Report");
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/Reports", adminAuth ,(req,res)=>{
    Report.findAll({ 
        include:[{model:Category}] //na busca de artigo estou incluindo os dados do tipo Category
    }).then(Reports => {
        res.render("admin/Reports/index", {Reports:Reports})
    })
   
})

router.get("/admin/Reports/new", adminAuth ,(req,res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/Reports/new", {categories:categories});
    })

    
})

router.post("/Reports/save", (req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;
    var location = req.body.location
    Report.create({
        categoryId: categoryId,
        title:title,
        slug:slugify(title),
        body:body,
        location:location
    }).then(()=>{
        res.redirect("/")
    
    })
})

router.post("/Reports/delete", (req,res)=>{
    var id = req.body.id;
    if(id!=undefined && id!=NaN){
        Report.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/Reports")
        })
    }else{
        res.redirect("/");
    }
})

router.get("/admin/Reports/edit/:id", adminAuth ,(req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/Reports");
    }
    //acima esse if serve para previnir que o id seja sempre um número
    Report.findOne({
        include: {model:Category},
        where: {id:id}
    }).then((Report)=>{
        if(Report!=undefined){
        Category.findAll().then(categories=>{
            res.render("admin/Reports/edit", {Report:Report, categories:categories});
        })
            
        }else{
            res.redirect("/admin/Reports");
        }
    }).catch(()=>{
        res.redirect("/admin/Reports");
    })
})

router.post("/Reports/update", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Report.update({title:title,slug:slugify(title), body:body, categoryId:categoryId},{where:{id:id}}).then(()=>{
        res.redirect("/admin/Reports");
    })
})

router.get("/Reports/page/:num", (req,res)=>{
    var page = req.params.num;
    var offset = 0;
    
    if(isNaN(page) || page <= 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    
    }
    
    Report.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(Reports=>{
        
        var next = false;
        if(offset + 4 >= Reports.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            Reports: Reports
        }

        Category.findAll().then(categories=>{
             res.render("admin/Reports/page", {result:result, categories:categories})
        })
    })
    //esse método serve pra encontrar todos artigos e retornar a quantidade deles também
    // os "rows" seriam os dados e o "count" a quantidade  Reports.rows Reports.count
})

module.exports = router;