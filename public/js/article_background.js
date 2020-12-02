let basic_img = document.querySelector(".basic_picture img");
let img_src = basic_img.src;
let body = document.querySelector("body");


body.style.backgroundImage = 'url('+img_src+')';
body.style.backgroundAttachment = "fixed";


