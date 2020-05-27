var config = {
	sunapee: {
		database: {
			host     : 'sunapee.cs.dartmouth.edu', 
			user     : 'GroceryTracker_sp20', //'your sunapee username here'
			password : '38Q?cRxfq4', //'your sunapee password here'
			schema : 'GroceryTracker_sp20' //'your sunapee default schema'
		},
		port: 3306
	},
	local: {
		database: {
			host     : 'localhost', 
			user     : 'your username (probably "root")', //'your localhost username here'
			password : 'your password', //your localhost password here'
			schema : 'nyc_inspections' //'your localhost default schema here'
		},
		port: 3000
	}
};
module.exports = config;