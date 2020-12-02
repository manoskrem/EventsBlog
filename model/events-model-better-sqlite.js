'use strict';
const db = require('better-sqlite3');
const sql = new db('./model/events_db.db', { fileMustExist: true });

exports.getAllEvents = function (callback) {
    const stmt = sql.prepare("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc");

    let events;
    try {
        events = stmt.all();
    } catch (error) {
        callback(error, null);
    }
    callback(null, events);

}
    
exports.getArticle = function(eventId , callback ){
    const stmt = sql.prepare("SELECT event.title , event.'start date' as start_date, event.'end date'as end_date, event.text , category.name as category, images.name as image "+
    "FROM event "+
    "JOIN belong on event.event_id = belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN images on event.event_id = images.'event id' " +
    "WHERE event.event_id = ?;");

    let event;
    try {
        event = stmt.all(eventId);
    } catch (error) {
        callback(error, null);
    }
    callback(null, event);
}

exports.getCategory = function(categoryName , callback ){
    const stmt = sql.prepare("SELECT event.event_id, event.title , images.name as image ,  category.banner "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id " +
    "WHERE category.name LIKE ? "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc");

    let events;
    try {
        events = stmt.all(categoryName);
    } catch (error) {
        callback(error, null);
    }
    callback(null, events);
  
};

exports.getCity = function(cityName , callback){
    const stmt = sql.prepare("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color , event.city "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "WHERE event.city is NULL OR event.city LIKE ? "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc")

    let events;
    try {
        events = stmt.all(cityName);
    } catch (error) {
        callback(error, null);
    }
    callback(null, events);

}

exports.getDate = function(date , callback){
    const stmt = sql.prepare("SELECT event.event_id, event.title , images.name as image , category.name as category, category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' " +
    "JOIN category on belong.'category id' = category.id "+
    "WHERE event.'start date' =? "+
    "OR (event.'start date' < ? AND (event.'end date'>? OR event.'end date' is NULL)) "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc");

    let events;
    try {
        events = stmt.all(date,date,date);
    } catch (error) {
        callback(error, null);
    }
    callback(null, events);

}

// USER CONTROLLERS
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.usernameExist = function(username,callback){
    const stmt = sql.prepare("SELECT * FROM user WHERE user.username LIKE ?");
    let Username;
    try {
        Username = stmt.all(username);
    } catch (error) {
        callback(error,null);
    }

    if (Username.length == 0){
        callback(null,false)
    }
    else{
        callback(null,true);
    }
        
}

exports.emailExist = function(email,callback){
    const stmt = sql.prepare("SELECT * FROM user WHERE user.email LIKE ?");
    let Email;
    try {
        Email = stmt.all(email);
    } catch (error) {
        callback(error,null);
    }

    if (Email.length == 0){
        callback(null,false)
    }
    else{
        callback(null,true);
    }
}

exports.favouriteExist = function(username,event_id,callback){
    const stmt = sql.prepare("SELECT * FROM favourites "+
    "WHERE favourites.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND favourites.'event id' = ?");
    let favourite;
    try {
        favourite = stmt.all(username,event_id);
    } catch (error) {
        callback(error,null);
    }
    if (favourite.length == 0){
        callback(null,false)
    }
    else{
        callback(null,true);
    }
}

exports.likeExist = function(username,event_id,callback){
    const stmt = sql.prepare("SELECT * FROM interest "+
    "WHERE interest.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND interest.'event id' = ?");    
    let like;
    try {
        like = stmt.all(username,event_id);
    } catch (error) {
        callback(error,null);
    }
    if (like.length == 0){
        callback(null,false)
    }
    else{
        callback(null,true);
    }    
            

}

exports.signUp = async function(username , password , email , city , callback){
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const stmt = sql.prepare("INSERT INTO user(username,password,email,city) "+
        "VALUES (? , ? , ? , ?); ");
        try {
            stmt.run(username,hashedPassword,email,city);
            const stmt1 = sql.prepare("INSERT INTO 'simple user'('user id') "+
                "VALUES ((SELECT user.user_id FROM user WHERE user.username LIKE ?)); ");

                try {
                    stmt1.run(username);
                    callback(null,true);
                    
                } catch (error) {
                    callback(error,null);
                }
                
                
        } catch (error) {
            callback(error,null);
        }
            
    
    }catch{
        callback(error,null);
    }
}

exports.login = async function(username , password , callback){
    try{
        const stmt = sql.prepare("SELECT user.password FROM user WHERE user.username LIKE ?");
        let dbpassword;
        try {
            dbpassword = stmt.all(username);
            const comparision = await bcrypt.compare(password, dbpassword[0].password);
            if(comparision){
                callback(null,true)
            }
            else{
                callback(null,false);
            }
        } catch (error) {
            callback(error,null);
        }
        
    }catch{
        callback(error,null);
    }

}

exports.getFavourites = function(username,callback){
    const stmt = sql.prepare("SELECT event.event_id, event.title , images.name as image, category.name as category , category.color as color "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN favourites on event.event_id = favourites.'event id' "+
    "WHERE favourites.'user id' = ((SELECT user.user_id FROM user WHERE user.username = ?)) "+
    "GROUP BY event.event_id ORDER BY event.'start date' desc");
    let events;
    try {
        events = stmt.all(username);
        callback(null, events);
    } catch (error) {
        callback(error, null);
    }
}

exports.addFavourite = function(username,event_id,callback){
    const stmt = sql.prepare("INSERT INTO favourites('user id', 'event id') "+
    "VALUES((SELECT user.user_id FROM user WHERE user.username = ?),?)");
    let fav;
    try {
        fav = stmt.run(username,event_id);
        callback(null, true);
    } catch (error) {
        console.log("ERROR = "+error);
        callback(error, null);
    }
    
}

exports.removeFavourite = function(username,event_id,callback){
    const stmt = sql.prepare("DELETE FROM favourites "+
    "WHERE favourites.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND favourites.'event id' = ?");
    let favourite;
    try {
        favourite = stmt.run(username,event_id);
        callback(null, true);
    } catch (error) {
        callback(error, null);
    }
}

exports.getLiked = function(username,callback){
    const stmt = sql.prepare("SELECT event.event_id "+
    "FROM event JOIN images on event.event_id=images.'event id' "+
    "JOIN belong on event.event_id= belong.'event id' "+
    "JOIN category on belong.'category id' = category.id "+
    "JOIN interest on event.event_id = interest.'event id' "+
    "WHERE interest.'user id' = ((SELECT user.user_id FROM user WHERE user.username = ?)) "+
    "GROUP BY event.event_id");
    let events;
    try {
        events = stmt.all(username);
        callback(null, events);
    } catch (error) {
        callback(error, null);
    }
    
}

exports.doLike = function(username,event_id,callback){
    const stmt = sql.prepare("INSERT INTO interest('user id', 'event id') "+
    "VALUES((SELECT user.user_id FROM user WHERE user.username = ?),?)");
    let like;
    try {
        like = stmt.run(username,event_id);
        callback(null, true);
    } catch (error) {
        callback(error, null);
    }
    
}

exports.doDislike =function(username,event_id,callback){
    const stmt = sql.prepare("DELETE FROM interest "+
    "WHERE interest.'user id' = (SELECT user.user_id FROM user WHERE username LIKE ?) "+
    "AND interest.'event id' = ?");
    let dislike;
    try {
        dislike = stmt.run(username,event_id);
        callback(null, true);
    } catch (error) {
        callback(error, null);
    }
}


exports.likesByEvent = function(callback){
    const stmt = sql.prepare("SELECT interest.'event id' as event_id , COUNT(interest.'event id') as count "+
    "FROM interest "+
    "GROUP BY interest.'event id' ");
    let events;
    try {
        events = stmt.all();
        callback(null, events);
    } catch (error) {
        callback(error, null);
    }
}

// PROFILE
exports.getProfile =  function(username,callback){
    const stmt = sql.prepare("SELECT * FROM user "+
    "WHERE user.user_id = ((SELECT user.user_id FROM user WHERE user.username = ?))");
    let profile;
    try {
        profile = stmt.all(username);
        callback(null,profile);
    } catch (error) {
        callback(error,null);
    }
}

exports.newUsernameExist = function(oldusername,newusername,callback){
    if(oldusername!=newusername){
        const stmt = sql.prepare("SELECT * FROM user WHERE user.username LIKE ?");
        let Username;
        try {
            Username = stmt.all(newusername);
            if (Username.length == 0){
                callback(null,false)
            }
            else{
                callback(null,true);
            }
        } catch (error) {
            callback(error,null);
        }
    }
    else{
        callback(null,false);
    }

}

exports.newEmailExist = function(oldemail,newemail,callback){
    if(oldemail!=newemail){
        const stmt = sql.prepare("SELECT * FROM user WHERE user.email LIKE ?");
        let Email;
        try {
            Email = stmt.all(newemail);
            if (Email.length == 0){
                callback(null,false);
            }
            else{
                callback(null,true);
            }
        } catch (error) {
            callback(error,null);
        }
    }
    else{
        callback(null,false);
    }
    
}

exports.correctPassword = async function(username,oldpassword,callback){
    try{
        if(oldpassword!=""){
            // console.log("OLDPASSWORD "+oldpassword)
            const stmt = sql.prepare("SELECT user.password FROM user WHERE user.username LIKE ?");
            let dbpassword;
            try {
                dbpassword = stmt.all(username);
                // console.log("\nDB PASSWORD = "+dbpassword+"\n\n");
                const comparison = await bcrypt.compare(oldpassword, dbpassword[0].password);
                // console.log("COMPARISON = "+comparison)
                if(comparison){
                    callback(null,true);
                }
                else{
                    callback(null,false);
                }
            } catch (error) {
                callback(error,null);
            }
        }
        else{
            callback(null,true);
        }
    }catch{
        callback(error,null);
    }
}

exports.update = async function(username,newusername,newemail,newcity,newpassword, callback){
    try {
        if(newpassword!=""){
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            const stmt = sql.prepare("UPDATE user "+
            "SET username = ? , email = ? , city = ? , password = ? "+
            "WHERE username = ?");
            let done;
            try {
                done = stmt.run(newusername,newemail,newcity,hashedPassword,username)
                callback(null,true);
            } catch (error) {
                callback(error,null);
            }
        }
        else{
            const stmt = sql.prepare("UPDATE user "+
            "SET username = ? , email = ? , city = ? "+
            "WHERE username = ?");
            let done;
            try {
                done = stmt.run(newusername,newemail,newcity,username)
                callback(null,true);
            } catch (error) {
                callback(error,null);
            }
        }
    }
    catch  {
        callback(error,null);
    }
 }

 exports.deleteUser = function(username,callback){
    const stmt = sql.prepare("DELETE FROM user WHERE user.username = ? ");
    let done;
    try {
        done = stmt.run(username);
        callback(null,true);
    } catch (error) {
        callback(error,null);
    }
}