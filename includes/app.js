dbServer = "mongodb://localhost:27017/";
dbName = "mydb";

http = require('http');
fs = require('fs');
url = require('url');
mongoClient = require('mongodb').MongoClient;
util = require('util');
csc = require('country-state-city');
ejs = require('ejs');
bcrypt = require('bcrypt');

Maths = require('./classes/Maths.js');
maths = new Maths;

BackFunc = require('./classes/BackFunc');
bFunc = new BackFunc();

Con = require('./classes/Connection.js');
con = new Con();

Database = require('./classes/Database.js');
db = new Database();

HtmlElement = require('./classes/HtmlElement');

View = require('./classes/View');
view = new View();

Sessions = require('./classes/Sessions');

PersistentSessions = require('./classes/PersistentSessions');
persistence = new PersistentSessions();

PostHandler = require('./classes/PostHandler.js');
postHandler = new PostHandler();

sessions = [];
sessionID = null;
cookies = {};
ip = null;
q = null;
loginURL = null;
loggedInURL = null;

codedCollections = {
    '1': 'users'
}

bFunc.runParallel({
    startSessions:con.startSessions()
}, result=>{
    con.createServer(8080);
    con.clearOldSessions();
    console.log(result)
});
