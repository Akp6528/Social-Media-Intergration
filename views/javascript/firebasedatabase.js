// const { resolveInclude } = require("ejs");

var database = firebase.database();

//get new key
async function getkey(path){
    return await firebase.database().ref(path).push().key;
}
// Using set() overwrites data at the specified location, including any child nodes.
async function createData(path, data) {
    return await database.ref(path).set(data);
}
//use .remove to remove the specified node
async function deleteData(path, dataname) {
    return await database.ref(path + '/' + dataname).remove();
}
//removes everything conatins in last node
async function deleteNode(path) {
    return await database.ref(path).remove();
}
//update or add data
async function updateData(path, data) {
    return await database.ref(path).update(data);
}
async function readData(path){
    var data = await database.ref(path).once('value');
    return data.val();
}

async function dataLength(path) {
    var data = await database.ref(path).once('value');
    return data.numChildren();
}