const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session')

require("dotenv").config();
// for body parser
app.use(express.urlencoded({ extended: false }));

const indexRoutes = require("./routes/")
const articleRoutes = require("./routes/articles");
const categoryRoutes = require("./routes/category");
const cityRoutes = require("./routes/city");
const dateRoutes = require("./routes/date");
const confirmRoutes = require("./routes/confirm");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const favouritesRoute = require("./routes/favourites");
const profileRoute = require("./routes/profile");

app.use(session({
    name: 'eventid',
    //Για την ιδιότητα 'secret':
    //Φτιάξτε ένα αρχείο με όνομα '.env' τον ίδιο φάκελο
    //και γράψτε μέσα SESSION_SECRET = enatyxaiomegaloalfarithmitiko
    //και εδώ γράψτε:
    //secret:    process.env.SESSION_SECRET, // κλειδί για κρυπτογράφηση του cookie
    secret:    "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,//1 ώρα
        sameSite: true,
        // secure: true //Το cookie θα σταλεί μόνο μέσω https. Σε απλό http δε θα λειτουργήσει
    }
}));

app.use("/",indexRoutes);
app.use("/articles", articleRoutes);
app.use("/category", categoryRoutes);
app.use("/city",cityRoutes);
app.use("/date",dateRoutes);
app.use("/confirm",confirmRoutes);
app.use("/register",registerRoute);
app.use("/login",loginRoute);
app.use("/logout",logoutRoute);
app.use("/favourites",favouritesRoute);
app.use("/profile",profileRoute);

app.use(express.static('public'));

app.engine("hbs", exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set("view engine","hbs");

module.exports = app;