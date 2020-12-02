'use strict';

// const model = require("../model/events-model-sqlite.js");
const model = require("../model/events-model-better-sqlite.js");

const uid = require('uid-safe')

// GUEST CONTROLLERS

exports.userLogin = function(req,res){
    const login = req.body;
    model.usernameExist(login.username, function(err,exist){
        if(err){
            res.send("ERROR AT USERNAME EXISTANCE");
        }
        else{
            if(exist){
                model.login(login.username, login.password , function(err,correct){
                    if(err){
                        res.send("ERROR AT PASSWORD");
                    }
                    else{
                        if (!correct){
                            res.render("login",{layout : "form_layout",
                            pagetitle : "Login",
                            city : "ΠΟΛΗ",
                            errorExist : true,
                            guest:true,
                            name : login.username,
                            password_error : "Λάθος κωδικός πρόσβασης"});
                        }
                        else{
                            // req.session.loggedUserId = uid.sync(18);
                            // req.session.loggedUsername = login.username;
                            // res.redirect("/city/");
                            model.getProfile(login.username,function(err,profile){
                                if(err){
                                    res.send(err);
                                }
                                else{
                                    if(profile[0].city!="ΠΟΛΗ"){
                                        req.session.loggedUserId = uid.sync(18);
                                        req.session.loggedUsername = login.username;
                                        res.redirect(`/city/${profile[0].city}`);
                                    }
                                    else{
                                        req.session.loggedUserId = uid.sync(18);
                                        req.session.loggedUsername = login.username;
                                        res.redirect(`/`);
                                    }
                                    
                                }
                            })
                        }
                    }
                })
            }
            else{
                res.render("login",{layout : "form_layout",
                pagetitle : "Login",
                city : "ΠΟΛΗ",
                errorExist : true,
                guest:true,
                username_error : "Δεν υπάρχει χρήστης με το όνομα '"+login.username+"'"});
            }
        }
    })
        
}

exports.userSignUp = function(req,res){
    const signUp = req.body;
    let username_exist = false;
    let email_exist = false;
    model.usernameExist(signUp.username, function(err,exist){
        if(err){
            res.send("err 1");
        }
        else{
            if(exist){
                username_exist = true;
            }
        }
    })
    model.emailExist(signUp.email, function(err,exist){
        if(err){
            res.send("err 2");
        }
        else{
            if(exist){
                email_exist = true;
            }
        }
        
    })
    model.signUp(signUp.username,signUp.password,signUp.email,signUp.city , function(err,signed){
        if(err){
            if(username_exist && !email_exist){
                res.render("register",{layout : "form_layout",
                    pagetitle : "register",
                    username_error : "To '"+signUp.username+"' υπάρχει ήδη!",
                    errorExist : true,
                    city : "ΠΟΛΗ",
                    guest:true
                })
            }
            else if(username_exist && email_exist){
                res.render("register",{layout : "form_layout",
                    pagetitle : "register",
                    username_error : "To '"+signUp.username+"' υπάρχει ήδη!",
                    email_error : "To '"+signUp.email+"' υπάρχει ήδη!",
                    errorExist : true,
                    city : "ΠΟΛΗ",
                    guest:true
                })
            }
            else if(!username_exist && email_exist){
                res.render("register",{layout : "form_layout",
                    pagetitle : "register",
                    email_error : "To '"+signUp.email+"' υπάρχει ήδη!",
                    errorExist : true,
                    city : "ΠΟΛΗ",
                    guest:true
                })
            }
        }
        else{
            res.redirect("/confirm");
          
            
        }
    })
}

exports.checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    // console.log("loggedUserId = "+req.session.loggedUserId);
    
    if (req.session.loggedUserId) {
        console.log("user is authenticated");
        
        const user = true;
        req.user = user;

        const username = req.session.loggedUsername;
        req.username = username;

        
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        const user = false;
        req.user = user;

        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
}

// GUEST RENDER

exports.indexPageRender = function(req,res){
        model.getAllEvents(function(err,events){
            if(err){
                res.send(err);
            }
            else{
                let rest = [];
                for(let i=16;i<events.length;i++){
                    rest[i-16] = events[i];
                }
                res.render('index',{events: events ,
                    rest:rest,
                    pageTitle : "Welcome to events!",
                    city : "ΠΟΛΗ",
                    guest:true});
            }
        })
}

exports.articleRender = function(req,res){
    const eventId = req.params.articleId;
    model.getArticle(eventId , function(err,event){
        if(err){
            res.send(err);
        }
        else{
            const images = []
            for(let i=0;i<event.length;i++){
                images[i] = event[i].image;
                images[i] = images[i].toString();
            }
            
            let expire = false;
            let date = new Date(event[0].end_date);
            let today = new Date();
            if (event[0].end_date!=null){
                if(today<date){
                    expire = false;
                    console.log(today+"<"+date);
                }
                else{
                    expire = true;
                }
            }
            else{
                expire = false;
            }

            res.render('article',{
            title : event[0].title,
            basic_picture : images[0],
            image : images,
            start_date : event[0].start_date,
            end_date : event[0].end_date,
            pageTitle : event[0].title,
            category : event[0].category,
            text : event[0].text,
            city : "ΠΟΛΗ",
            guest:true,
            expire : expire
            });
        }
    })
}

exports.categoryRender =function(req,res){
    const categoryName = req.params.categoryName;
    model.getCategory(categoryName, function(err,category){
        if(err){
            res.send(err);
        }
        else{
            res.render('category',{
            pageTitle : categoryName,
            banner: "/img/"+category[0].banner,
            category : categoryName,
            events : category,
            city : "ΠΟΛΗ",
            guest:true
            });

        }
    })

}

exports.cityRender=function(req,res){
    const cityName = req.params.cityName;
    let b_image = "";
    if (cityName==="ΘΕΣΣΑΛΟΝΙΚΗ"){
        b_image = "/img/THESSALONIKI.jpg";
    }
    else if(cityName==="ΑΘΗΝΑ"){
        b_image = "/img/ATHENS.jpg";
    }
    else if(cityName==="ΠΑΤΡΑ"){
        b_image = "/img/PATRA.jpg";
    }
    else{
        b_image = "/img/EPIDAVRUS.jpg";
    }
    model.getCity(cityName, function(err,city){
        if(err){
            res.send(err);
        }
        else{
            res.render('city',{
            pageTitle : "ΕΚΔΗΛΩΣΕΙΣ ΣΤΗΝ "+cityName,
            city : cityName,
            events : city,
            city : cityName,
            guest:true,
            b_image : b_image
            });
        }
    });

}

exports.dateRender = function(req,res){
    const date = req.params.date;
    
    model.getDate(date, function(err,events){
        if (err) {
            res.send(err);
        }
        else{
            res.render('date',{
                pageTitle : "ΕΚΔΗΛΩΣΕΙΣ ΣΤΙΣ "+date,
                date : date,
                events : events,
                city : "ΠΟΛΗ",
                guest:true
            });
        }
    })
}

exports.registerRender = function(req,res){
    const user = req.user;
    if(!user){
        res.render("register",{layout : "form_layout",
            pagetitle : "Register",
            city : "ΠΟΛΗ",
            guest:true});
    }
}

exports.confirmRegistration = function(req,res){
    const user = req.user;
    if(!user){
        res.render("confirm-registration",{pagetitle : "confirm registration",
                    city : "ΠΟΛΗ",
                    guest:true});
    }
}

exports.loginRender = function(req,res){
    const user = req.user;
    if(!user){
        res.render("login",{layout : "form_layout",
        pagetitle : "Login",
        city : "ΠΟΛΗ",
        guest:true});
    }
    
}



