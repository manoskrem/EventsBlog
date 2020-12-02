// REGISTER
function validatePassword(){

    let username = document.getElementById("sign_up_username");
    let password = document.getElementById("sign_up_password")
    let confirm = document.getElementById("confirm"); 

    //username 6 charachters
    if(username.value.length<6 || username.value.length>10){
        username.setCustomValidity("Το όνομα πρέπει να περιλαμβάνει από 6 εως 10 χαρακτήρες");
    }
    else{
        username.setCustomValidity("");
    }

    //Password = Confirm
    if(password.value != confirm.value) {
        confirm.setCustomValidity("Οι κωδικοί δεν ταιριάζουν!");
    } else {
        
        confirm.setCustomValidity('');
    }
}
// PROFILE
function updateUser(){
    let username = document.getElementById("update_username");
    let password = document.getElementById("old_password")
    let newPassword = document.getElementById("update_password");
    let confirm = document.getElementById("confirm_update"); 
    username.setCustomValidity("Το νέο όνομα πρέπει να περιλαμβάνει από 6 εως 10 χαρακτήρες");

    //username 6 charachters
    if(username.value.length<6 || username.value.length>10){
        console.log("Το νέο όνομα πρέπει να περιλαμβάνει από 6 εως 10 χαρακτήρες");
        username.setCustomValidity("Το νέο όνομα πρέπει να περιλαμβάνει από 6 εως 10 χαρακτήρες");
    }
    else{
        username.setCustomValidity("");
    }
    
    //Password = Confirm
    if(password.value == ""){
        console.log(`1 OLD PASSWORD VALUE = ${password.value}`);
        console.log(`1 NEW PASSWORD VALUE = ${newPassword.value}`);
        if(newPassword.value !=""){
            password.setCustomValidity("Για να αλλάξεις κωδικό πρόσβασης συμπλήρωσε τον παλιό κωδικό");
        }
        else{
            password.setCustomValidity("");
        }
    }

    else if(newPassword.value == ""){
        console.log(`2 OLD PASSWORD VALUE = ${password.value}`);
        console.log(`2 NEW PASSWORD VALUE = ${newPassword.value}`)
        if(password.value !=""){
            newPassword.setCustomValidity("Για να αλλάξεις κωδικό πρόσβασης συμπλήρωσε τον νέο κωδικό");
        }
        else{
            newPassword.setCustomValidity("");
        }
    }

    else if(newPassword.value != confirm.value) {
        password.setCustomValidity("");
        newPassword.setCustomValidity("");
        confirm.setCustomValidity("Οι κωδικοί δεν ταιριάζουν!");
        } 
    else {
        password.setCustomValidity("");
        newPassword.setCustomValidity("");
        confirm.setCustomValidity('');
    }
 
}
