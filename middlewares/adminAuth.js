function adminAuth(req,res,next){
    
    if(req.session.user != undefined){
        next();
    }else{
        res.redirect("/login");
    }
    
    
    //importante sempre puxar o next pra o middleware permitir acesso a rota
}

module.exports = adminAuth;