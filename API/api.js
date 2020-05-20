/* 	Node API demo
	Author: Tim Pierson, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local|sunapee>
	App will use the database credentials and port stored in config.js for local or sunapee server
	Recommend Postman app for testing verbs other than GET, find Postman at https://www.postman.com/
*/

var express=require('express');
let mysql = require('mysql');
const bodyParser = require('body-parser'); //allows us to get passed in api calls easily
var app=express();

// get config
var env = process.argv[2] || 'local'; //use localhost if enviroment not specified
var config = require('./config')[env]; //read credentials from config.js


//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
		host     : config.database.host, 
		user     : config.database.user, 
		password : config.database.password, 
		database : config.database.schema 
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// set up routing
// calls should be made to /api/restaurants with GET/PUT/POST/DELETE verbs
// you can test GETs with a browser using URL http://localhost:3000/api/restaurants or http://localhost:3000/api/restaurants/30075445
// recommend Postman app for testing other verbs, find it at https://www.postman.com/
router.get("/api",function(req,res){
	res.send("Hello, you've reached my API without calling anything. Sup?");
});


// POST - receive new user registration data
//TODO: must include password authentication/storage system
router.post("/api/users/new", function(req,res){
	console.log(req.body)
	global.connection.query('INSERT INTO Users VALUES (?, ?, ?, ?)', [req.params.userID], [req.params.userName],[req.params.userEmail],[req.params.userPassword],function (error, results, fields) {		//TODO: finish query
		if(error) res.send("Insertion error. Please retry or contact sysadmin");
		else res.send(JSON.stringify({"status": 201, "error": null, "response": results})); //TODO: does this need to be modified?
	});
});

// GET - read data from database, return status code 200 if successful
router.get("/api/restaurants",function(req,res){
	// get all restaurants (limited to first 10 here), return status code 200
	global.connection.query('SELECT * FROM nyc_inspections.Restaurants LIMIT 10', function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

router.get("/api/users/:id",function(req,res){
	console.log(req.params.id);
	//read a single restaurant with RestauantID = req.params.id (the :id in the url above), return status code 200 if successful, 404 if not
	global.connection.query('SELECT UserID, UserName, UserEmail FROM Users WHERE UserID = ?', [req.params.id],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});



// start server running on port 3306 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3306 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});