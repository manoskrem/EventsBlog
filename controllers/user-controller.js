'use strict';

// const model = require("../model/events-model-sqlite.js");
const model = require("../model/events-model-better-sqlite.js");

// USER CONTROLLERS

exports.logout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    req.session.destroy();
    res.clearCookie('eventid');
    res.redirect('/');
}

exports.addFavourite = (req,res)=>{
    const user = req.user;
    const username = req.username;
    const event_id = req.params.event_id
    console.log(event_id);
    if(user){
        model.favouriteExist(username,event_id,function(err,exist){
            if(err){
                res.send(`ERR AT FAVOURITE EXISTANCE`);
            }
            else{
                if(!exist){
                    console.log("1) ADD FAVOURITE")
                    model.addFavourite(username,event_id,function(err,done){
                        console.log("   DONE = "+done);
                        if(err){
                            res.send(`ERR AT ADDFAVOURITE`);
                        }
                        else{
                            console.log("2) ADD FAVOURITE")
                            res.json(done)
                        }
                    })
                }
                else{
                    model.removeFavourite(username,event_id,function(err,done){
                        if(err){
                            res.send(`ERR AT REMOVE FAVOURITE`);
                        }
                        else{
                            res.json(done)
                        }
                    })
                }
            }
        })
    }
}

exports.showInterest = (req,res)=>{
    const user = req.user;
    const username = req.username;
    const event_id = req.params.event_id
    console.log(event_id);
    if(user){
        model.likeExist(username,event_id,function(err,exist){
            if(err){
                res.send(`ERR AT LIKE EXISTANCE`);
            }
            else{
                if(!exist){
                    model.doLike(username,event_id,function(err,done){
                        if(err){
                            res.send(`ERR AT DOLIKE`);
                        }
                        else{
                            res.json(done)
                        }
                    })
                }
                else{
                    model.doDislike(username,event_id,function(err,done){
                        if(err){
                            res.send(`ERR AT DODISLIKE`);
                        }
                        else{
                            res.json(done)
                        }
                    })
                }
            }
        })
    }
}

exports.updateUser =  function(req,res){
    const update = req.body;
    let oldusername = req.username;
    
    let old_password = update.password;
    let new_password = update.new_password;

    let username_exist = false;
    let email_exist = false;
    let password_error = false;

    model.getProfile(oldusername,  function(err,profile){
        if(err){
            res.send("error at get profile");
        }
        else{
            // ΚΑΠΟΙΕΣ ΦΟΡΕΣ ΜΟΥ ΒΓΑΖΕΙ ΑΠΟ ΤΟ ΠΟΥΘΕΝΑ ΣΦΑΛΜΑ
            // username = profile[0].username;
            const oldemail =  profile[0].email;
            const oldcity = profile[0].city;
            
            model.newUsernameExist(oldusername,update.username, function(err,exist){
                if(err){
                    res.send("err 1");
                }
                else{
                    if(exist){
                        username_exist=true
                    }
                    else{
                        username_exist=false;
                    }
                    model.newEmailExist(oldemail , update.email, function(err,exist){
                        if(err){
                            res.send("err 2");
                        }
                        else{
                            if(exist){
                                email_exist=true;
                            }
                            else{
                                email_exist=false;
                            }
                            
                            model.correctPassword(oldusername,old_password,function(err,done){
                                if(err){
                                    password_error=true;
                                }
                                else{
                                    if(done){
                                        password_error=false;
                                    }
                                    else{
                                        password_error=true;
                                    }
                                }

                                console.log(password_error);

                                if(password_error){
                                    res.render('profile',{
                                        pageTitle : "MyProfile",
                                        city : "ΠΟΛΗ",
                                        guest:false,
                                        username: oldusername,
                                        prof_name : oldusername,
                                        prof_email : oldemail,
                                        prof_city : oldcity,
                                        username_error : "To '"+update.username+"' υπάρχει ήδη!",
                                        u_error_exist : username_exist,
                                        email_error : "To '"+update.email+"' υπάρχει ήδη!",
                                        e_error_exist : email_exist,
                                        password_error : "Εισάγετε σωστό κωδικό πρόσβασης!",
                                        p_error_exist : password_error,
                                    });
                                }
                                else{
                                    model.update(oldusername,update.username,update.email,update.city,new_password,function(err,done){
                                        if(err){
                                            res.render('profile',{
                                                pageTitle : "MyProfile",
                                                city : "ΠΟΛΗ",
                                                guest:false,
                                                username: oldusername,
                                                prof_name : oldusername,
                                                prof_email : oldemail,
                                                prof_city : oldcity,
                                                username_error : "To '"+update.username+"' υπάρχει ήδη!",
                                                u_error_exist : username_exist,
                                                email_error : "To '"+update.email+"' υπάρχει ήδη!",
                                                e_error_exist : email_exist,
                                                password_error : "Εισάγετε σωστό κωδικό πρόσβασης!",
                                                p_error_exist : password_error,
                                            });
                                        }
                                        else{
                                            req.session.loggedUsername= update.username;
                                            res.render('profile',{
                                                pageTitle : "MyProfile",
                                                city : "ΠΟΛΗ",
                                                guest:false,
                                                username: update.username,
                                                prof_name : update.username,
                                                prof_email : update.email,
                                                prof_city : update.city,
                                                success : true
                                            });
                                            
                                            
                                        }
                                    })
                                }

                               
                        })
                        }
                    })
                }
            });


            
        }

    })

}

exports.deleteUser = function(req,res){
    let username = req.username;

    model.deleteUser(username,function(err,done){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/logout");
        }
    })
}

// USER RENDER
exports.indexPageRenderU = function(req,res,next){
    const user = req.user;
    const username = req.username;
    if(user){
        let favourite_events =[];
        let liked_events = [];
        model.getFavourites(username,function(err,favourites){
            if(err){res.send(err)}
            else{
                favourite_events = favourites;
            }
        })
        model.getLiked(username,function(err,likes){
            if(err){res.send(err)}
            else{
                liked_events = likes;
            }
        });
        let like_counter = [];
        model.likesByEvent(function(err,eventlike){
            if(err){res.send(err)}
            else{
                like_counter = eventlike;
                
            }
        })
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
                    guest:false,
                    username: username,
                    favourites : favourite_events,
                    likes : liked_events,
                    counters : like_counter});
            }
        })
        
    }else{
        next();
    }
   
}

exports.articleRenderU = function(req,res,next){
    const user = req.user;
    const username = req.username;
    if(user){
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
                guest:false,
                username: username,
                expire : expire
                });
            }
        })
    }
    else{
        next();
    }
    
}

exports.categoryRenderU = function(req,res,next){
    const user = req.user;
    const username = req.username;
    const categoryName = req.params.categoryName;
    if(user){
        let favourite_events =[]; 
        let liked_events = [];
        model.getFavourites(username,function(err,favourites){
            if(err){res.send(err)}
            else{
                favourite_events = favourites;
            }   
        })
        model.getLiked(username,function(err,likes){
            if(err){res.send(err)}
            else{
                liked_events = likes;
            }
        });
        let like_counter = [];
        model.likesByEvent(function(err,eventlike){
            if(err){res.send(err)}
            else{
                like_counter = eventlike;
                
            }
        })
        model.getCategory(categoryName, function(err,category){
            if(err){
                res.send(err);
            }
            else{
                res.render('category',{pageTitle : categoryName,
                banner: "/img/"+category[0].banner,
                category : categoryName,
                events : category,
                city : "ΠΟΛΗ",
                guest:false,
                username: username,
                favourites : favourite_events,
                likes : liked_events,
                counters : like_counter
                });
            }
        })
    }
    else{
        next();
    }
}

exports.cityRenderU = function(req,res,next){
    const username = req.username;
    const user = req.user;
    if(user){
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
        let favourite_events = [];
        let liked_events = [];
        model.getFavourites(username,function(err,favourites){
            if(err){res.send(err)}
            else{
                favourite_events = favourites;
            }
        })
        model.getLiked(username,function(err,likes){
            if(err){res.send(err)}
            else{
                liked_events = likes;
            }
        });
        let like_counter = [];
        model.likesByEvent(function(err,eventlike){
            if(err){res.send(err)}
            else{
                like_counter = eventlike;
                
            }
        })
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
                guest:false,
                username: username,
                favourites : favourite_events,
                likes : liked_events,
                counters : like_counter,
                b_image :b_image
                });
            }
        });
    }
    else{
        next();
    }
}

exports.dateRenderU = function(req,res,next){
    const username = req.username;
    const user = req.user;
    if(user){
        const date = req.params.date;
        let favourite_events =[];
        let liked_events = [];
        model.getFavourites(username,function(err,favourites){
            if(err){res.send(err)}
            else{
                favourite_events = favourites;
            }
        })
        model.getLiked(username,function(err,likes){
            if(err){res.send(err)}
            else{
                liked_events = likes;
            }
        });
        let like_counter = [];
        model.likesByEvent(function(err,eventlike){
            if(err){res.send(err)}
            else{
                like_counter = eventlike;
                
            }
        })
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
                    guest:false,
                    username: username,
                    favourites : favourite_events,
                    likes : liked_events,
                    counters : like_counter
                });
            }
        })
    }
    else{
        next();
    }
}

exports.favouritesRender = function(req,res){
    const username = req.username;
    console.log("USERNAME = "+username);
    let liked_events = [];
    model.getLiked(username,function(err,likes){
        if(err){res.send(err)}
        else{
            liked_events = likes;
        }
    });
    let like_counter = [];
        model.likesByEvent(function(err,eventlike){
            if(err){res.send(err)}
            else{
                like_counter = eventlike;
                
            }
        })
    model.getFavourites(username,(err,events)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render("favourites",{
                events: events ,
                pageTitle : "Favourites",
                city : "ΠΟΛΗ",
                guest:false,
                username: username,
                likes : liked_events,
                counters : like_counter});
        }
    })
}

exports.profileRender = function(req,res){
    const username = req.username;
    console.log("USERNAME = "+username);
    model.getProfile(username,function(err,profile){
        if(err){
            res.send("error at get profile");
        }
        else{
            // ΚΑΠΟΙΕΣ ΦΟΡΕΣ ΜΟΥ ΒΓΑΖΕΙ ΑΠΟ ΤΟ ΠΟΥΘΕΝΑ ΣΦΑΛΜΑ
            const profname = profile[0].username;
            const profemail = profile[0].email;
            const profcity = profile[0].city;
            res.render('profile',{
                pageTitle : "MyProfile",
                city : "ΠΟΛΗ",
                guest:false,
                username: username,
                prof_name : profname,
                prof_email : profemail,
                prof_city : profcity
            });
        }
    })
}







