/* 	Node API demo
	Author: Tim Pierson, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local|sunapee>
	App will use the database credentials and port stored in config.js for local or sunapee server
	Recommend Postman app for testing verbs other than GET, find Postman at https://www.postman.com/
*/

var express = require("express");
let mysql = require("mysql");
const bodyParser = require("body-parser"); //allows us to get passed in api calls easily
var app = express();

// get config
var env = process.argv[2] || "local"; //use localhost if enviroment not specified
var config = require("./config")[env]; //read credentials from config.js
const passport = require("passport"); // For authentication
const dotenv = require("dotenv");
const jwt = require("jwt-simple");
var HttpStatus = require('http-status-codes');

dotenv.config({ silent: true });
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Database connection
app.use(function (req, res, next) {
  global.connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.schema,
  });
  connection.connect();
  next();
});

// Set up Passport for authentication
const initializePassport = require("./passport-config");

// Generate unique token for users when they sign up / sign in
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode(
    { sub: user.UserID, iat: timestamp },
    process.env.AUTH_SECRET
  );
}

initializePassport(passport);

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console and allow CORS stuff because it refused to work otherwise
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
	if (req.method == "OPTIONS" ) {
    console.log("Got OPTIONS request");
    res
    .status(HttpStatus.OK)
    .send('ok');
  } else {
    console.log("/" + req.method);
    next();
  }
});

// set up routing
// calls should be made to /api/restaurants with GET/PUT/POST/DELETE verbs
// you can test GETs with a browser using URL http://localhost:3000/api/restaurants or http://localhost:3000/api/restaurants/30075445
// recommend Postman app for testing other verbs, find it at https://www.postman.com/
// router.get("/api/jwt", passport.authenticate('jwt', { session: false }), function (req, res) {
//   console.log("jwt succesful. User is "+JSON.stringify(req.user));
//   res.send("Hello, you've reached my API without calling anything. Sup?");
// });

// Temporary route for testing passport authentication
router.post("/api/signin", passport.authenticate("local", { session: false }),
  function (req, res) {
    console.log("Authentication succesful. User is:");
    // req.user is the authenticated user object
	console.log(req.user);
	res.send({ token: tokenForUser(req.user) });
  }
);

// I have sinfully kluged a server "ping" as a call to get * from the products table
// no user should ever call this. If they do, I chose the least hacker-usable table to get.
router.get("/api/products", function (req, res) {
  global.connection.query("SELECT * FROM Products WHERE false", function (
    error,
    results,
    fields
  ) {
    if (error) res.send("error");
    else
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

/* -------- USERS -------- */

// POST - receive new user registration data
//TODO: must include password authentication/storage system
//TODO: how to use server to assign UserID?

router.put("/api/signup", function (req, res) {
console.log("got signup request");
  const plain_password = req.body.UserPassword;
  bcrypt.hash(plain_password, saltRounds, function (err, hash) {
    global.connection.query(
      "INSERT INTO Users (UserName, UserEmail, UserPassword) VALUES (?)",
      [[req.body.UserName, req.body.UserEmail, hash]],
      function (error, results, fields) {
        if (error)
          res.send(
            "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
              error +
              "\nreq.body.UserID= " +
              req.body.UserID
          );
        // else res.send(results);
        else {
          console.log(results);
          newUser = { UserID: results.insertID };
          res.send({ token: tokenForUser(newUser) });
        }
      }
    );
  });
});

//TODO: security/password
router.get("/api/users/get", function (req, res) {
  global.connection.query(
    "SELECT UserID, UserName, UserEmail FROM Users WHERE UserID= 3",
    function (error, results, fields) {
      if (error)
        res.send(
          "Get error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      // else res.send({"status": 200, "error": null, "response": results});
      else {
        console.log("Results are: ");
        console.log(results);
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

//TODO: security/password
router.delete("/api/users/delete", function (req, res) {
  global.connection.query(
    "DELETE FROM Users WHERE UserID= ?",
    [req.body.UserID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

//TODO: Auth
router.post("/api/users/update/username", function (req, res) {
  // console.log(JSON.stringify(req.body));
  global.connection.query(
    "UPDATE Users SET UserName= ? WHERE UserID= ?",
    [req.body.TgtUserName, req.body.TgtUserID],
    function (error, results, fields) {
      if (error) {
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      } else {
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

//TODO: Auth
router.post("/api/users/update/email", function (req, res) {
  // console.log(JSON.stringify(req.body));
  global.connection.query(
    "UPDATE Users SET UserEmail= ? WHERE UserID= ?",
    [req.body.TgtUserEmail, req.body.TgtUserID],
    function (error, results, fields) {
      if (error) {
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
        // console.log(error)
      } else {
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

//TODO: Auth
router.post("/api/users/update/password", function (req, res) {
  // console.log(JSON.stringify(req.body));
  global.connection.query(
    "UPDATE Users SET UserPassword= ? WHERE UserID= ?",
    [req.body.TgtUserPassword, req.body.TgtUserID],
    function (error, results, fields) {
      if (error) {
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
        // console.log(error)
      } else {
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

/* -------- PRODUCTS -------- */

router.put("/api/products/new", function (req, res) {
  global.connection.query(
    "INSERT INTO Products VALUES (?)",
    [[req.body.ProductID, req.body.ProductName, req.body.ProductDaysPerWidget]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 201, error: null, response: results })
        );
    }
  ); //puts the thing on the user's inventory too
});

router.post("/api/products/update/dpw", function (req, res) {
  global.connection.query(
    "UPDATE Products SET ProductDaysPerWidget= ? WHERE ProductID= ?",
    [req.body.DaysPerWidget, req.body.ProductID],
    function (error, results, fields) {
      if (error) {
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      } else {
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

router.post("/api/products/update/name", function (req, res) {
  global.connection.query(
    "UPDATE Products SET ProductName= ? WHERE ProductID= ?",
    [req.body.ProductName, req.body.ProductID],
    function (error, results, fields) {
      if (error) {
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      } else {
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
      }
    }
  );
});

router.delete("/api/products/delete", function (req, res) {
  global.connection.query(
    "DELETE FROM Products WHERE ProductID= ?",
    [req.body.ProductID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

/* -------- STORES -------- */

router.put("/api/stores/new", function (req, res) {
  global.connection.query(
    "INSERT INTO Stores (StoreName, StoreStreetNum, StoreStreet, StoreCity, StoreZIP) VALUES (?)",
    [
      [
        req.body.StoreName,
        req.body.StoreStreetNum,
        req.body.StoreStreet,
        req.body.StoreCity,
        req.body.StoreZIP,
      ],
    ],
    function (error, results, fields) {
      if (error)
        res.send(
          "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 201, error: null, response: results })
        );
    }
  );
});

router.put("/api/stores/newUser", passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log("Inserting into Users_hasStores, userID is: " +req.user.UserID + " store id is "+req.body.StoreID);
  global.connection.query(
    "INSERT INTO Users_has_Stores VALUES (?)",
    [[req.user.UserID, req.body.StoreID]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 201, error: null, response: results })
        );
    }
  );
});

router.post("/api/stores/update", function (req, res) {
  global.connection.query(
    "UPDATE Stores SET StoreStreetNum= ?, StoreStreet= ?, StoreCity= ?, StoreZIP= ? WHERE StoreID= ?",
    [
      req.body.StoreStreetNum,
      req.body.StoreStreet,
      req.body.StoreCity,
      req.body.StoreZIP,
      req.body.StoreID,
    ],
    function (error, results, fields) {
      if (error)
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.post("/api/stores/update/name", function (req, res) {
  global.connection.query(
    "UPDATE Stores SET StoreName= ? WHERE StoreID= ?",
    [req.body.StoreName, req.body.StoreID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Update error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.delete("/api/stores/delete", function (req, res) {
  global.connection.query(
    "DELETE FROM Stores WHERE StoreID= ?",
    [req.body.StoreID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.delete("/api/stores/deleteUser", function (req, res) {
  global.connection.query(
    "DELETE FROM Users_has_Stores WHERE Stores_StoreID= ? AND Users_UserID= ?",
    [req.body.StoreID, req.body.UserID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

/* -------- INVENTORY -------- */

router.put("/api/inventory/new", function (req, res) {
  global.connection.query(
    "INSERT INTO Inventory VALUES (?, 1, TRUE)",
    [[req.body.UserID, req.body.ProductID]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 201, error: null, response: results })
        );
    }
  ); //puts the thing on the user's inventory too
});

router.delete("/api/inventory/delete", function (req, res) {
  global.connection.query(
    "DELETE FROM Inventory WHERE Products_ProductID= ? AND Users_UserID= ?",
    [[req.body.ProductID], [req.body.UserID]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.post("/api/inventory/update/onList", function (req, res) {
  //TODO
});

router.post("/api/inventory/update/daysRemaining", function (req, res) {
  //TODO
});

router.get("/api/inventory/get", function (req, res) {
  global.connection.query(
    "SELECT ProductName, InventoryRemainingDays, PutOnShoppingList FROM Inventory LEFT JOIN Products ON Products.ProductID= Inventory.Products_ProductID WHERE Users_UserID= ?",
    [req.body.UserID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Get error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.post("/api/inventory/goneShopping", function (req, res) {
  //TODO: if you pass it the user, it gets the shopping list and buys one of everything
  //TODO: if you pass it a JSON object of what you bought and how much, it'll update accordingly
});

/* -------- STOREPRODUCTS -------- */

router.put("/api/storeProducts/new", function (req, res) {
  global.connection.query(
    "INSERT INTO Stores_has_Products VALUES (?)",
    [[req.body.ProductID, req.body.StoreID, ""]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Insertion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 201, error: null, response: results })
        );
    }
  );
});

router.post("/api/storeProducts/update", function (req, res) {
  //TODO: update note
});

router.get("/api/storeProducts/note", function (req, res) {
  //TODO: get the note of a product
});

router.delete("/api/storeProducts/delete", function (req, res) {
  global.connection.query(
    "DELETE FROM Stores_has_Products WHERE Stores_StoreID= ? AND Products_ProductID= ?",
    [[req.body.StoreID], [req.body.ProductID]],
    function (error, results, fields) {
      if (error)
        res.send(
          "Deletion error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

/* -------- QUERIES -------- */

//TODO: I think this doesn't work and I don't know why
router.get("/api/store/products", function (req, res) {
  global.connection.query(
    "SELECT ProductName, StoreName FROM Stores JOIN Stores_has_Products ON Stores.StoreID= Stores_has_Products.Stores_StoreID JOIN Products ON Stores_has_Products.Products_ProductID= Products.ProductID WHERE StoreID= ?",
    [req.body.StoreID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Get error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );
});

router.get("/api/products/store", function (req, res) {
  global.connection.query(
    "SELECT ProductName, StoreName FROM Products LEFT JOIN Stores_has_Products ON Products.ProductID= Stores_has_Products.Products_ProductID LEFT JOIN Stores ON Stores_has_Products.Stores_StoreID= Stores.StoreID WHERE ProductID= ?",
    [req.body.ProductID],
    function (error, results, fields) {
      if (error)
        res.send(
          "Get error. Please retry or contact sysadmin. Here's the error:\n" +
            error
        );
      else
        res.send(
          JSON.stringify({ status: 200, error: null, response: results })
        );
    }
  );

  // I think I'd need to know what stores contain product x instead
});

router.get("/api/shoppingList", function (req, res) {
  if ("StoreID" in req.body) {
    global.connection.query(
      "SELECT ProductID, ProductName, StoreName FROM Inventory LEFT JOIN Products ON Inventory.Products_ProductID= Products.ProductID LEFT JOIN Stores_has_Products ON Products.ProductID= Stores_has_Products.Products_ProductID LEFT JOIN Stores ON Stores_has_Products.Stores_StoreID= Stores.StoreID WHERE Users_UserID= ? AND StoreID= ? AND InventoryRemainingDays < 7",
      [req.body.UserID, req.body.StoreID],
      function (error, results, fields) {
        if (error)
          res.send(
            "Update error. Please retry or contact sysadmin. Here's the error:\n" +
              error
          );
        else
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
      }
    );
  } else {
    //TODO: there's a security hole here where the user might be able to see stores they don't have access to. It will be fixed by including a reference to Users_has_Stores
    global.connection.query(
      "SELECT ProductID, ProductName, StoreName FROM Inventory LEFT JOIN Products ON Inventory.Products_ProductID= Products.ProductID LEFT JOIN Stores_has_Products ON Products.ProductID= Stores_has_Products.Products_ProductID LEFT JOIN Stores ON Stores_has_Products.Stores_StoreID= Stores.StoreID WHERE Users_UserID= ? AND InventoryRemainingDays < 7",
      [req.body.UserID],
      function (error, results, fields) {
        if (error)
          res.send(
            "Update error. Please retry or contact sysadmin. Here's the error:\n" +
              error
          );
        else
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
      }
    );
  }
  //TODO: view the shopping list
  //TODO: if you pass a JSON object, it will return the shopping list only for the desired stores
});

// // GET - read data from database, return status code 200 if successful
// router.get("/api/restaurants",function(req,res){
// 	// get all restaurants (limited to first 10 here), return status code 200
// 	global.connection.query('SELECT * FROM nyc_inspections.Restaurants LIMIT 10', function (error, results, fields) {
// 		if (error) throw error;
// 		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
// 	});
// });

// router.get("/api/users/:id",function(req,res){
// 	console.log(req.params.id);
// 	//read a single restaurant with RestauantID = req.params.id (the :id in the url above), return status code 200 if successful, 404 if not
// 	global.connection.query('SELECT UserID, UserName, UserEmail FROM Users WHERE UserID = ?', [req.params.id],function (error, results, fields) {
// 		if (error) throw error;
// 		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
// 	});
// });

// start server running on port 3306 (or whatever is set in env)
app.use(express.static(__dirname + "/"));
app.use("/", router);
app.set("port", process.env.PORT || config.port || 3306);

app.listen(app.get("port"), function () {
  console.log("Node server is running on port " + app.get("port"));
  console.log("Environment is " + env);
});
