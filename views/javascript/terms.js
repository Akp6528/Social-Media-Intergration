function makeadmin(){
    //add custom claims
    var userid = firebase.auth().currentUser.uid;
    return fetch("/makeAdmin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({userid}),
    }).then(()=>{
        //update in a database
        updateData('users/' + userid, {"isAdmin": "true",});
        window.location.reload();
    });
}