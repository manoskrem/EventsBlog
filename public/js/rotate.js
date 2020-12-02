let thumbs = document.querySelector(".thumbs")
let upper_main_img = document.querySelectorAll(".upper_main img");
let upper_main_txt = document.querySelectorAll(".upper_main p");
let upper_main_link = document.querySelectorAll(".art_link");
let upper_categories = document.querySelectorAll(".upper_categories");

function img_rotate(){

    let old_src = [];
    let old_txt = [];
    let old_a = [];
    let old_cat = [];
    let old_cat_a =[]
    let old_col = [];

    let new_src = [];
    let new_txt = [];
    let new_a = [];
    let new_cat = [];
    let new_cat_a =[]
    let new_col = [];

    for(let i=0;i<4;i++){
        old_src[i]=upper_main_img[i].getAttribute("src");
        old_txt[i]=upper_main_txt[i].textContent;
        old_a[i] = upper_main_link[i].getAttribute("href");
        old_cat[i]=upper_categories[i].textContent;
        old_cat_a[i]=upper_categories[i].getAttribute("href");
        old_col[i] = upper_categories[i].style;

        if(i!=0){
            new_src[i]=upper_main_img[i-1].getAttribute("src");
            new_txt[i]=upper_main_txt[i-1].textContent;
            new_a[i]=upper_main_link[i-1].getAttribute("href");
            new_cat[i]=upper_categories[i-1].textContent;
            new_cat_a[i]=upper_categories[i-1].getAttribute("href");
            new_col[i]=upper_categories[i-1].getAttribute("style");
        }
        else{
            new_src[0]=upper_main_img[3].getAttribute("src");
            new_txt[0]=upper_main_txt[3].textContent;
            new_a[0]=upper_main_link[3].getAttribute("href");
            new_cat[0]=upper_categories[3].textContent;
            new_cat_a[0]=upper_categories[3].getAttribute("href");
            new_col[0]=upper_categories[3].getAttribute("style");
        }
    }
    for(let i=0;i<4;i++){
        upper_main_img[i].style.opacity = 0.5;
        setTimeout(function(){
            upper_main_img[i].src = new_src[i];
            upper_main_txt[i].textContent = new_txt[i];
            upper_main_link[i].href=new_a[i];
            upper_categories[i].textContent = new_cat[i] ;
            upper_categories[i].href = new_cat_a[i];
            upper_categories[i].style=new_col[i]},300)
        setTimeout(function(){
            upper_main_img[i].style.opacity = 1;},400)
    }

}

setInterval(img_rotate,5000);
