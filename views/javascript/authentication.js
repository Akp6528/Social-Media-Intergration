//firebase deatils
var firebaseConfig = {
    apiKey: "AIzaSyAgCQhS46FDPWyLF0yle8k4Dbvezd0bLcQ",
    authDomain: "mango-98d28.firebaseapp.com",
    databaseURL: "https://mango-98d28.firebaseio.com",
    projectId: "mango-98d28",
    storageBucket: "mango-98d28.appspot.com",
    messagingSenderId: "1035807977670",
    appId: "1:1035807977670:web:3b734ee75701d537f567c7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//email varify
function sendVarification() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user.sendEmailVerification().then(function () {
                document.getElementById('sendvarif').disabled = true;
                setTimeout(function () {
                    document.getElementById('sendvarif').disabled = false;
                }, 10000);
            });
        } else {
            window.location.assign('/');
        }
    });
}
//sign out
function singOut() {
    firebase.auth().signOut().then(function () {
        window.location.pathname = '/sessionLogout';
    });
}
//create accoubt with google
function singUp(email, password, displayname) {
    var uuser;
    var d = new Date();
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(({user}) => {
            uuser = user;
            return user.getIdToken().then((idToken) => {
                //update userdata
                user.updateProfile({
                    displayName: "" + displayname,
                }).then(function () {
                }).catch((e)=>{
                });

                //create database of user
                createData('/users/' + user.uid, {
                    "displayName": displayname,
                    "email": email,
                    "joinedOn": d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear(),
                    "username":user.uid,
                });

                //final step creat local login and add custom claims
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({idToken,uuser}),
                });
            });
        }).then(()=>{
            window.location.assign('/dashboard');
        })
        .catch((e) => {
            document.getElementById("loader-wrapper").style.animation = "loader-wrapper linear forwards";
            if (e.code === 'auth/email-already-in-use') {
                alert("email-already-in-use");
                window.location.reload();
            }
        });
}
//sign in with email
function signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(({user}) => {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({
                        idToken
                    }),
                });
            });
        })
        .then(() => {
            window.location.assign("/dashboard");
        }).catch((e)=>{
            document.getElementById("loader-wrapper").style.animation = "loader-wrapper linear forwards";
            if (e.code === 'auth/wrong-password'){
                alert("wrong password");
                window.location.reload();
            } else if (e.code === "auth/user-not-found") {
                alert("user not found");
                window.location.reload();
            }else{
                alert("wrong password");
                window.location.reload();
            }
        });
}
//sign in with google
function singInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    var d = new Date();
    firebase.auth().signInWithPopup(provider).then(({user}) => {
        //create database of user
        if (user.metadata.creationTime === user.metadata.lastSignInTime)
        {
            createData('/users/' + user.uid, {
                "displayName": user.displayName,
                "email": user.email,
                "joinedOn": d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
                "username": user.uid,
            });
        }

        //final step creat local login
        return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({
                    idToken
                }),
            });
        });
    })
    .then(() => {
        window.location.assign("/dashboard");
    });
}
//sign in with facebook
function singInWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    var d = new Date();
    firebase.auth().signInWithPopup(provider).then(({user}) => {
        //create database of user
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            createData('/users/' + user.uid, {
                "displayName": user.displayName,
                "email": user.email,
                "joinedOn": d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
                "username": user.uid,
            });
        }

        //final step creat local login
        return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({
                    idToken
                }),
            });
        });
    })
    .then(() => {
        window.location.assign("/dashboard");
    });
}
//sign in with github
function singInWithGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    var d = new Date();
    firebase.auth().signInWithPopup(provider).then(({user}) => {
        //create database of user
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            createData('/users/' + user.uid, {
                "displayName": user.displayName,
                "email": user.email,
                "joinedOn": d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
                "username": user.uid,
            });
        }
        //final step creat local login
        return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({
                    idToken
                }),
            });
        });
    })
    .then(() => {
        window.location.assign("/dashboard");
    });
}
function passReset(){
    let email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('email sent please log in to continue');
        window.location.assign('/');
    }).catch(function (error) {
        alert('error occured email not sent');
    });
}
//onload listner //universal
document.addEventListener('DOMContentLoaded', (event) => {
    // if(window.location.pathname == '/')
    // {

    // }
});