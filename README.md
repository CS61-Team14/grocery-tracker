# grocery-tracker

**CS61 20S**
**Auth: TG20, AL , NP , RCB**

Have you ever had to check and re-check your pantry to see what you're running out of the day before a shopping run? Do you have to juggle multiple stores to get what you need, only to realize you missed one thing?

This is the solution. The Grocery Tracker Tool (name pending) allows you to easily determine what you need to get more of based on averaged consumption rates.

##Environment Setup

This is so my groupmates don't have to root around figuring this stuff out like I did.

the `.gitignore` should already cover all the files these processes create, but add it to the `.gitignore` if you find anomalous files added, especially if in bulk.

###npm nodemon, express, and mysql

run the following commands:

	`npm install nodemon`

	`npm install express`

	`npm install mysql`

`nodemon` allows `api.js` to restart whenever changed

`express` and `mysql` are dependencies of `api.js`.

I don't know if `npm` is windows-only. See if there's an equivalent if `npm` isn't recognized.

###Remember to Download Node.js

That is all.

###Python

set up a Python execution environment in Testing if you need to.

###Pointing and Ports

The API runs on Port `3306`. Use `localhost:3306/api` to access it. It should already be loaded into Python, but 
