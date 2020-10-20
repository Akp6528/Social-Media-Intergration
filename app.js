const express = require('express');
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const session = require('express-session');

//firebase admin config
const serviceAccount = require("./node-24180-firebase-adminsdk-ivp6d-b5d01219b5.json");
const { json } = require('body-parser');

//port of out web application access is using localhost:4000
const port =  process.env.PORT || 4000;

//setting csrf to cookies
const csrfMiddleware = csrf({
    cookie: true
});

//firebase admin instance
var firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://node-24180.firebaseio.com"
});

//express app creation
const app = express();

//ejs files embeded javasccipt file
app.set('view engine', 'ejs');

//to use static folders
app.use(express.static('views'));
//to use bodyparsher whenever someone request
app.use(bodyParser.json());
//to use cookieparsher whenever someone request
app.use(cookieParser());
//to use csrf middelware
app.use(csrfMiddleware);
//to use sesssions in node
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
}));
//middelware currently no use
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});



//login page
app.get('/', function (req, res) {
    const sessionCookie = req.cookies.session || "";
    //check if logged in
    admin.auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */ )
        .then((decodedClaims) => {
            admin.auth().getUser(decodedClaims.uid)
                .then(function (userRecord) {
                    req.session.userdatasession = userRecord;
                    res.redirect("/dashboard");
                });
        }).catch(() => {
            res.render('index');
        });
});
//home page
app.get('/dashboard', function (req, res) {
    const sessionCookie = req.cookies.session || "";
    //check if session is there or not
    if (req.session.userdatasession) {
        if (req.session.userdatasession.emailVerified) {
            if ((req.session.userdatasession.customClaims) ? req.session.userdatasession.customClaims.admin : false) {
                res.render("dashboard",{data: req.session.userdatasession.email});
            }else{
                res.render("terms",{data: req.session.userdatasession.email});
            }    
        }else {
            res.render("varification", {data: req.session.userdatasession.email});
        }
    } else {
        admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ )
            .then((decodedClaims) => {
                    //chek if email is varified
                    admin.auth().getUser(decodedClaims.uid).then((userdata)=>{
                            req.session.userdatasession = userdata;
                            if (userdata.emailVerified) {
                                if ((userdata.customClaims) ? userdata.customClaims.admin : false) {
                                    res.render("dashboard",{data: userdata.email});
                                } else {
                                    res.render("terms",{data: userdata.email});
                                }
                            } else {
                                res.render("varification", {data: userdata.email});
                            }
                        });
            }) //if not logged in
            .catch((error) => {
                res.redirect("/");
        });
    }
});

app.get('/forget', function (req, res) {
    res.render('forget');
});



//varification ecreate session
app.get("/recreate", (req, res) => {
    req.session.userdatasession = null;
    res.redirect("/dashboard");
});
//makeadmin
app.post("/makeAdmin", (req, res) => {
    const uid = req.body.userid;
    res.redirect("/");
    admin.auth().setCustomUserClaims(uid, {
        admin: true
    }).then(() => {
        res.end(JSON.stringify({
            status: "success"
        }));
    });
});
//login
app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 30 * 10 * 1000;
    admin.auth().createSessionCookie(idToken, {expiresIn})
        .then((sessionCookie) => {
            const options = {maxAge: expiresIn,httpOnly: true};
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({
                status: "success"
            }));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        }
    );
});
//logout
app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    req.session.userdatasession = null;
    res.redirect("/");
});


app.listen(port);
