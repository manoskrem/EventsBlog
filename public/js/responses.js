

const fav = document.querySelectorAll(".favourite"); 
const fav_icon = document.querySelectorAll(".favourite i"); 
const like = document.querySelectorAll(".like");
const like_icon = document.querySelectorAll(".like i");

let like_c = document.querySelectorAll(".like_counter");
// let like_c_content ; 

function toLogin(){
    for(let i=0;i<fav.length;i++){
        fav[i].addEventListener("click",function(){
            window.location.href='/login';
        })
        like[i].addEventListener("click",function(){
            window.location.href='/login';
        })
    }
}

function react(){
    for(let i=0;i<fav.length;i++){
        fav[i].addEventListener("click", () => {
            console.log("FAVOURITE ΤΟ "+fav[i].getAttribute("event-id"));
            addFavourite(fav[i].getAttribute("event-id"));
            if(fav_icon[i].className == "far fa-heart"){
                fav_icon[i].className = "fas fa-heart";
                fav_icon[i].style = "color:red";
            }
            else{
                fav_icon[i].className = "far fa-heart";
                fav_icon[i].style = "color:#333";
            }
        });
    }
    for(let i=0;i<like.length;i++){
        like[i].addEventListener("click",function(){
            showInterest(like[i].getAttribute("event-id"));
            if(like_icon[i].className == "far fa-thumbs-up"){
                like_icon[i].className = "fas fa-thumbs-up";
                like_icon[i].style = "color:#4267B2";
                if(like_c[i].textContent === ""){
                    like_c[i].textContent = "1";
                }
                else{
                    like_c[i].textContent = parseInt(like_c[i].textContent) + 1;
                }
            }
            else{
                like_icon[i].className = "far fa-thumbs-up";
                like_icon[i].style = "color:#333";
                if(parseInt(like_c[i].textContent) === 1){
                    like_c[i].textContent = "";
                }
                else{
                    like_c[i].textContent = parseInt(like_c[i].textContent) - 1;
                }
            }
            console.log("LIKE ΤΟ "+like[i].getAttribute("event-id"))
        });
    }
}

let addFavourite = function(event_id){
    fetch("/addfavourite/"+event_id)
    .then(response => response.json());
}

let showInterest = function(event_id){
    fetch("/showInterest/"+event_id)
    .then(response=>response.json());
}


