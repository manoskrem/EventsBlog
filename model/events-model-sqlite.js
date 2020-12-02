'use strict';
let sql = require('./db.sqlite.js');

// RENDER
exports.getAllEvents = function (callback) {
    sql.all("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc", function (err, events) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
};

exports.getArticle = function(eventId , callback ){
    sql.all("SELECT event.title , event.'start date' as start_date, event.'end date'as end_date, event.text , category.name as category, images.name as image "+
    "FROM event "+
    "JOIN belong on event.event_id = belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN images on event.event_id = images.'event id' " +
    "WHERE event.event_id = ?;",eventId , function (err, event) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, event);
        }
    });

};

exports.getCategory = function(categoryName , callback ){
    sql.all("SELECT event.event_id, event.title , images.name as image ,  category.banner "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id " +
    "WHERE category.name LIKE ? "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc", categoryName ,function (err, events) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
  
};

exports.getCity = function(cityName , callback){
    sql.all("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color , event.city "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "WHERE event.city is NULL OR event.city LIKE ? "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc", cityName ,function (err, events) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
}

exports.getDate = function(date , callback){
    sql.all("SELECT event.event_id, event.title , images.name as image , category.name as category, category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' " +
    "JOIN category on belong.'category id' = category.id "+
    "WHERE event.'start date' =? "+
    "OR (event.'start date' < ? AND (event.'end date'>? OR event.'end date' is NULL)) "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc",date,date,date,function(err,events){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
}


// USER CONTROLLERS
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.usernameExist = function(username,callback){
    sql.all("SELECT * FROM user WHERE user.username LIKE ?",username,function(err,Username){
        if (err){
            callback(err,null);
        }
        else{
            if (Username.length == 0){
                callback(null,false)
            }
            else{
                callback(null,true);
            }
        }
        
    })
}

exports.emailExist = function(email,callback){
    sql.all("SELECT * FROM user WHERE user.email LIKE ?",email,function(err,Email){
        if (err){
            callback(err,null);
        }
        else{
            if (Email.length == 0){
                callback(null,false)
            }
            else{
                callback(null,true);
            }
        }
        
    })
}

exports.favouriteExist = function(username,event_id,callback){
    sql.all("SELECT * FROM favourites "+
    "WHERE favourites.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND favourites.'event id' = ?",username,event_id,function(err,favourite){
        if (err){
            callback(err,null);
        }
        else{
            if (favourite.length == 0){
                callback(null,false)
            }
            else{
                callback(null,true);
            }
        }
    })
}

exports.likeExist = function(username,event_id,callback){
    sql.all("SELECT * FROM interest "+
    "WHERE interest.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND interest.'event id' = ?",username,event_id,function(err,like){
        if (err){
            callback(err,null);
        }
        else{
            if (like.length == 0){
                callback(null,false)
            }
            else{
                callback(null,true);
            }
        }
    })
}

exports.signUp = async function(username , password , email , city , callback){
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        sql.all("INSERT INTO user(username,password,email,city) "+
        "VALUES (? , ? , ? , ?); ",username,hashedPassword,email,city,(err,res)=>{
            if(err){
                callback(err,null);
            }
            else{
                sql.all("INSERT INTO 'simple user'('user id') "+
                "VALUES ((SELECT user.user_id FROM user WHERE user.username LIKE ?)); ",username,(err,res)=>{
                    if(err){
                        callback(err,null);
                    }
                    else{
                        callback(null,true);
                    }
                })
                
            }
        })
    }catch{
        callback(err,null);
    }
}

exports.login = async function(username , password , callback){
    try{
        sql.all("SELECT user.password FROM user WHERE user.username LIKE ?",username,async function(err,dbpassword){
            if(err){
                callback(err,null);
            }
            else{
                const comparision = await bcrypt.compare(password, dbpassword[0].password);
                if(comparision){
                    callback(null,true)
                }
                else{
                    callback(null,false);
                }
            }
        })
    }catch{
        callback(err,null);
    }

}

exports.getFavourites = function(username,callback){
    sql.all("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN favourites on event.event_id = favourites.'event id' "+
    "WHERE favourites.'user id' = ((SELECT user.user_id FROM user WHERE user.username = ?)) "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc",username ,function (err, events) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
}

exports.addFavourite = function(username,event_id,callback){
    sql.all("INSERT INTO favourites('user id', 'event id') "+
    "VALUES((SELECT user.user_id FROM user WHERE user.username = ?),?)",username,event_id,function (err, fav){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, true);
        }
    });
}

exports.removeFavourite = function(username,event_id,callback){
    sql.all("DELETE FROM favourites "+
    "WHERE favourites.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND favourites.'event id' = ?",username,event_id,function(err,favourite){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, true);
        }
    })
}

exports.getLiked = function(username,callback){
    sql.all("SELECT event.event_id "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN interest on event.event_id = interest.'event id' "+
    "WHERE interest.'user id' = ((SELECT user.user_id FROM user WHERE user.username = ?)) "+
    "GROUP BY event.event_id",username ,function (err, events) {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    });
}

exports.doLike = function(username,event_id,callback){
    sql.all("INSERT INTO interest('user id', 'event id') "+
    "VALUES((SELECT user.user_id FROM user WHERE user.username = ?),?)",username,event_id,function (err, like){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, true);
        }
    });
}

exports.doDislike =function(username,event_id,callback){
    sql.all("DELETE FROM interest "+
    "WHERE interest.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND interest.'event id' = ?",username,event_id,function(err,dislike){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, true);
        }
    })
}

exports.likesByEvent = function(callback){
    sql.all("SELECT interest.'event id' as event_id , COUNT(interest.'event id') as count "+
    "FROM interest "+
    "GROUP BY interest.'event id' ",function(err,events){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, events);
        }
    })
}
// PROFILE
exports.getProfile =  function(username,callback){
    sql.all("SELECT * FROM user "+
    "WHERE user.user_id = ((SELECT user.user_id FROM user WHERE user.username = ?))",username,  function(err,profile){
        if(err){
            callback(err,null);
        }
        else{
             callback(null,profile);
        }
    })
}

exports.newUsernameExist = function(oldusername,newusername,callback){
    if(oldusername!=newusername){
        sql.all("SELECT * FROM user WHERE user.username LIKE ?",newusername,function(err,Username){
            if (err){
                callback(err,null);
            }
            else{
                if (Username.length == 0){
                    callback(null,false)
                }
                else{
                    callback(null,true);
                }
            }
        })
    }
    else{
        callback(null,false);
    }

}

exports.newEmailExist = function(oldemail,newemail,callback){
    if(oldemail!=newemail){
        sql.all("SELECT * FROM user WHERE user.email LIKE ?",newemail,function(err,Email){
            if (err){
                callback(err,null);
            }
            else{
                if (Email.length == 0){
                    callback(null,false);
                }
                else{
                    callback(null,true);
                }
            }
        })
    }
    else{
        callback(null,false);
    }
    
}
exports.correctPassword = async function(username,oldpassword,callback){
    try{
        if(oldpassword!=""){
            // console.log("OLDPASSWORD "+oldpassword)
            sql.all("SELECT user.password FROM user WHERE user.username LIKE ?",username,async function(err,dbpassword){
                if(err){
                    callback(err,null);
                }
                else{
                    console.log("\nDB PASSWORD = "+dbpassword+"\n\n");
                    const comparison = await bcrypt.compare(oldpassword, dbpassword[0].password);
                    console.log("COMPARISON = "+comparison)
                    if(comparison){
                        callback(null,true);
                    }
                    else{
                        callback(null,false);
                    }
                }
            })
        }
        else{
            callback(null,true);
        }
    }catch{
        callback(err,null);
    }
}

exports.update = async function(username,newusername,newemail,newcity,newpassword, callback){
    try {
        if(newpassword!=""){
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            sql.all("UPDATE user "+
            "SET username = ? , email = ? , city = ? , password = ? "+
            "WHERE username = ?",newusername,newemail,newcity,hashedPassword,username,function(err,done){
                if(err){
                    console.log("EDO TO LATHOS")
                    callback(err,null);
                }
                else{
                    callback(null,true);
                }
            })
        }
        else{
            sql.all("UPDATE user "+
            "SET username = ? , email = ? , city = ? "+
            "WHERE username = ?",newusername,newemail,newcity,username,function(err,done){
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,true);
                }
            })
        }
        
    }
    catch  {
        callback(err,null);
    }
    

}

exports.deleteUser = function(username,callback){
    sql.all("DELETE FROM user WHERE user.username = ? ",username,function(err,done){
        if(err){
            callback(err,null);
        }
        else{
            callback(err,true);
        }
    })
}
