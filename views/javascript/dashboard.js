var storage = firebase.storage();

let courseimage;
let courseimageUpdate;


//course image show and store in var
document.getElementById('courseimage').onchange = (e)=>{
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        var frame = document.getElementById('courseframe');
        frame.style.backgroundSize = "cover";
        frame.style.backgroundPosition = 'center';
        frame.style.backgroundImage = "url(" + reader.result + ")";
    };
    if (file) {
        reader.readAsDataURL(file);
        courseimage = file;
    }
};

async function loadCourses() {
    var data = await readData('/courses');
    var iscourse = false;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('courses').innerHTML = '';
            for (var course in data) {
                if (data[course].authorId === user.uid) {
                    iscourse = true;
                    document.getElementById('courses').innerHTML += `
                        <div onclick="menuclick('courseedit') ;loadcourseinfo('` + course + `') ;" role='button' class = "mb-2 py-8 flex flex-wrap border border-dark rounded-lg md:flex-no-wrap" >
                            <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                <span class = "tracking-widest font-medium title-font text-gray-900" >
                                    ` + data[course].category + `
                                </span>
                                <span span class = "mt-1 text-gray-500 text-sm" >
                                    ` + data[course].publishDate + `
                                </span>
                            </div>
                            <div class="md:flex-grow">
                                <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">
                                    ` + data[course].nameOfCourse + `
                                </h2>
                                <p class="leading-relaxed">
                                    ` + data[course].courseDescription + `
                                </p>
                            </div>
                        </div>
                        `;
                }
            }
            if (!iscourse) {
                // 
            }
        }
        else {
            //error
           alert('somethng went wrong!! login again and continue');
        }
    });
}

async function addcourse(){
    var d = new Date();
    var name = document.getElementById('coursename').value;
    var descritption = document.getElementById('coursedescription').value;
    var catagory = document.getElementById('catagory').value;
    var summery = document.getElementById('textarea1').value;
    var key = await getkey('/');

    if(courseimage){
    var task = storage.ref('courses/'+key+'/course_img.jpeg').put(courseimage);
    task.on('state_changed',
        function progress(snapshot) {},
        function error(err) {},
        function complete() {
            task.snapshot.ref.getDownloadURL().then(async (url) => {
                try {
                    await createData('/courses/' + key, {
                        "authorId": firebase.auth().currentUser.uid,
                        "category": catagory,
                        "courseDescription": descritption,
                        "couserId": key,
                        "imgPath": url,
                        "keyPoints": summery,
                        "nameOfCourse": name,
                        "publishDate": d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
                    });
                    await createData('/courseTopics/' + key, false);
                    document.getElementById("addcourse").innerHTML = addcoursepage;
                    courseimage = null;
                } catch (error) {
                    alert(error);
                }
            }).catch((error)=>{
                alert(error);
            });
        });
    }else{
        try {
            await createData('/courses/' + key, {
                "authorId": firebase.auth().currentUser.uid,
                "category": catagory,
                "courseDescription": descritption,
                "couserId": key,
                "imgPath": "",
                "keyPoints": summery,
                "nameOfCourse": name,
                "publishDate": d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
            });
            await createData('/courseTopics/' + key, false);
            document.getElementById("addcourse").innerHTML = addcoursepage;
        } catch (error) {
            alert(error);
        }
    }
}

async function loadcourseinfo(course){
    var data1 = await readData('/courses/' + course);
    
    document.getElementById('coursesinsideedit').innerHTML = await `
        <div onclick="btnclick('courseupdateimage')" class="form-group row">
            <label for="firstname" class="col-md-2 col-form-label">Course Image </label>
            <div class="col-md-10">
                <input id="courseupdateimage" class="d-none" type="file" accept="image/x-png,image/jpeg">
                <button style="background-image: url('`+data1.imgPath+`');" id='courseupdateframe' class="imageframe">Click to change Image</button>
            </div>
        </div>

        <div class="form-group row">
            <label for="firstname" class="col-md-2 col-form-label">Course Name </label>
            <div class="col-md-10">
                <input id="coursenameupdate" type="text" value="`+ data1.nameOfCourse +`" class="form-control">
            </div>
        </div>

        <div class="form-group row">
            <label for="lastname" class="col-md-2 col-form-label">Course Description</label>
            <div class="col-md-10">
                <input id="coursedescriptionupdate" type="text" value="`+ data1.courseDescription +`" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="emailid" class="col-md-1 col-form-label">Course Category</label>
            <div class="col-md-5 offset-md-1">
                <select id="catagoryupdate" class="form-control">
                    <option value="`+ data1.category + `">Default(` + data1.category +`)</option>
                    <option value="programing">Programming</option>
                </select>
            </div>
        </div>

        <div class="form-group row">
            <label for="add" class="col-md-2 col-form-label">Key Points</label>
            <div class="col-md-3">
                <textarea class="form-control" id="textarea1update" name="add">`+ data1.keyPoints + `</textarea>
            </div>
        </div>

        <div class="form-group row">
            <div class="offset-md-2 col-md-10">
                <div onclick="deleteCourse('`+course+`')" class="btn btn-danger">delete course</button>
                <button onclick="editcourseinfo('`+ course +`')" class="btn btn-primary">Update</button>
            </div>
        </div>
    `;

    document.getElementById('courseupdateimage').onchange = (e) => {
        courseimageUpdate = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            var frame = document.getElementById('courseupdateframe');
            frame.style.backgroundSize = "cover";
            frame.style.backgroundPosition = 'center';
            frame.style.backgroundImage = "url(" + reader.result + ")";
        };
        if (file) {
            reader.readAsDataURL(profileImage);
            courseimageUpdate = file;
        }
    };
    
    var data2 = await readData('/courseTopics/' + course);
    var d2len = await dataLength('/courseTopics/' + course);

    if(data2){
        document.getElementById('chapters').innerHTML = '';
        for (var i=0; i < d2len;i++)
        {
            document.getElementById('chapters').innerHTML += await `
                <div id="chap`+i+`">
                    <h3>Chapter `+i+`</h3>
                    <div class="form-group row">
                        <label for="lastname" class="col-md-2 col-form-label">Title</label>
                        <div class="col-md-10">
                            <input id="title`+i+`" type="text" value="`+data2[i].title+`" class="form-control">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="lastname" class="col-md-2 col-form-label">Description</label>
                        <div class="col-md-10">
                            <input id="description`+i+`" value="`+data2[i].description+`" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="lastname" class="col-md-2 col-form-label">URL</label>
                        <div class="col-md-10">
                            <input id="url`+i+`" value="`+data2[i].url+`" type="url" class="form-control">
                        </div>
                    </div>
                    <hr>
                </div>
            `;
        }
    }else{
        document.getElementById('chapters').innerHTML ='';
    }

    document.getElementById('chaptetrbutton').innerHTML = `
    <div class="offset-md-2 col-md-10">
        <button onclick="document.getElementById('chapters').lastChild.previousSibling.remove();"  class="btn btn-danger">Remove last chapter</button>
        <button onclick="addchap()" class="btn btn-success">Add Chapters</button>
        <button onclick="editchapters('`+course+`')" class="btn btn-primary">Update</button>
    </div>
    `;

    
}

async function editcourseinfo(key){
    var name = document.getElementById('coursenameupdate').value;
    var descritption = document.getElementById('coursedescriptionupdate').value;
    var catagory = document.getElementById('catagoryupdate').value;
    var summery = document.getElementById('textarea1update').value;
    if (courseimageUpdate) {
    var task = storage.ref('courses/'+key+'/course_img.jpeg').put(courseimageUpdate);
    task.on('state_changed',
        function progress(snapshot) { },
        function error(err) { },
        function complete() {
            task.snapshot.ref.getDownloadURL().then(async (url) => {
                try {
                    await updateData('/courses/' + key, {
                        "category": catagory,
                        "courseDescription": descritption,
                        "imgPath": url,
                        "keyPoints": summery,
                        "nameOfCourse": name,
                    });
                    menuclick('courses');
                    loadCourses();
                    courseimageUpdate = null;
                } catch (error) {
                    alert(error);
                }
            }).catch((error) => {
                alert(error);
            });
        });
    }else{
        try {
            await updateData('/courses/' + key, {
                "category": catagory,
                "courseDescription": descritption,
                "keyPoints": summery,
                "nameOfCourse": name,
            });
            menuclick('courses');
            loadCourses();
        } catch (error) {
            alert(error);
        }
    }
}

function addchap() {
    var i = document.getElementById('chapters').childElementCount;
    document.getElementById('chapters').innerHTML += `
         <div id="chap`+i+`">
            <h3>Chapter `+i+`</h3>
            <div class="form-group row">
                <label for="lastname" class="col-md-2 col-form-label">Title</label>
                <div class="col-md-10">
                    <input id="title`+i+`" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <label for="lastname" class="col-md-2 col-form-label">Description</label>
                <div class="col-md-10">
                    <input id="description`+i+`" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <label for="lastname" class="col-md-2 col-form-label">URL</label>
                <div class="col-md-10">
                    <input id="url`+i+`" type="url" class="form-control">
                </div>
            </div>
            <hr>
        </div>
    `;
}

async function editchapters(key){
    var data = [];
    var j = document.getElementById('chapters').childElementCount;
    //loop through all data and appen to data var;
    if(j != 0){
        for (var i = 0;i<j;i++) {
            var t = document.getElementById("title"+i+"").value;
            var d = document.getElementById("description" + i + "").value;
            var u = document.getElementById("url" + i + "").value;
            var dataup = {"description": d,"title": t,"url": u};
            data.push(dataup);
        }
    }
    try {
        await createData('/courseTopics/' + key, data);
        menuclick('courses');
        loadCourses();
    } catch (error) {
        alert(error);
    }
}

async function loadprofile(){
    var uid = firebase.auth().currentUser.uid;
    var data = await readData('/users/'+uid);
    document.getElementById('name').value = data.displayName;
    document.getElementById('uname').value = data.username;
}

async function updateprofile() {
    var user = firebase.auth().currentUser;
    var name = document.getElementById('name').value;
    var uname = document.getElementById('uname').value;
    try {
        await user.updateProfile({displayName:name});
        await updateData('/users/'+ user.uid ,{displayName:name,username:uname});
        alert('profile updated');
    } catch (error) {
        alert(error);
    }
    
}

async function deleteCourse(key){
   try {
        await deleteNode('/courseTopics/' + key);
        await deleteNode('/courses/' + key);
        await storage.ref('/courses/' + key + '/course_img.jpeg');
   } catch (error) {
       alert(error);
   }
}