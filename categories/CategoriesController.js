const express = require('express');
const router = express.Router();
const Category = require("./Category");
const Report = require("../Reports/Report");
const slug = require("slugify");
const { default: slugify } = require('slugify');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth ,(req,res)=>{
    res.render("admin/categories/new");
})

router.post("/categories/save", (req,res)=>{
    var title = req.body.title;
    if(title!=undefined){
        Category.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
})

router.get("/admin/categories", adminAuth ,(req,res)=>{
    Category.findAll().then((categories)=>{
        res.render("admin/categories/index", {categories:categories});  
    })
     
})

router.post("/categories/delete", (req,res)=>{
    var id = req.body.id;
    if(id!=undefined && id!=NaN){
        Category.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            Report.destroy({
                where:{
                    categoryId:null
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
            
        })
    }else{
        res.redirect("/");
    }
})

router.get("/admin/categories/edit/:id", adminAuth ,(req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    //acima esse if serve para previnir que o id seja sempre um número
    Category.findByPk(id).then((category)=>{
        if(category!=undefined){
            res.render("admin/categories/edit", {category:category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(()=>{
        res.redirect("/admin/categories");
    })
})

router.post("/categories/update", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var slug = slugify(title);

    Category.update({title:title,slug:slug},{where:{id:id}}).then(()=>{
        res.redirect("/admin/categories");
    })
})

module.exports=router;