import requests
import json

'''
Client side demo to fetch data from a RESTful API.  Assumes Node.js file api is running (nodemon api.js <localhost|sunapee>) 
on the server side.
Author: Tim Pierson, Dartmouth CS61, Spring 2020
Requires installation of mysql connector: pip install mysql-connector-python
	also requires Requests: pip install requests
Based on: https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html

Usage: python call_api.py 
'''


def make_get_call(url, data):
    # make get call to url
    resp = requests.get(url, json= data)
    # expecting to get a status of 200 on success
    if resp.json()['status'] != 200:
        # This means something went wrong.
        print('Something went wrong {}'.format(resp.status_code))
        exit()
    # print data returned
    print("get succeeded")
    print("received: ")
    print(resp.json())
    # for employee in resp.json()['response']:
    #     print(employee["EmployeeID"], employee["EmployeeLastname"], employee["AdminPrivileges"])

def make_post_call(url, data):
    # make post call to url passing it data
    resp = requests.post(url, json=data)
    # expecting to get a status of 201 on success
    if resp.json()['status'] != 201:
        print('Something went wrong {}'.format(resp.status_code))
        exit()
    print('post succeeded')
    print("received: ")
    print(resp.json())


def make_put_call(url, data):
    # make post call to url passing it data
    # structure this as such: "EmployeeFirstName= 'Bill'"
    # one field at a time
    resp = requests.put(url, json=data)
    # expecting to get a status of 200 on success
    if resp.json()['status'] != 200:
        print('Something went wrong {}'.format(resp.status_code))
        exit()
    print('put succeeded')
    print("received: ")
    print(resp.json())


def make_delete_call(url):
    # make post call to url passing it data
    resp = requests.delete(url)
    # expecting to get a status of 200 on success
    if resp.json()['status'] != 200:
        print('Something went wrong {}'.format(resp.status_code))
        exit()
    print('delete succeeded')
    print("received: ")
    print(resp.json())

def handleInput(usr, pwd):
    print("get, post, put, or delete query?\ntype '/' to cancel operation")
    actionType= input()
    if actionType[0] == "/":
        if actionType== "/quit":
            return False
    elif actionType == "get":
        print("\tgetting. Enter subject ID or press return for your own:")
        tgtID= input()
        if tgtID[0] == '/':
            pass
        elif tgtID== "":
            data = {"username": usr, "pwd": pwd}
            make_get_call('http://localhost:3000/api/employees/', data)
        else:
            data = {"username": usr, "pwd": pwd, "EmployeeID": tgtID}
            make_get_call('http://localhost:3000/api/employees/'+tgtID, data)
    elif actionType == "post":
        print("\tposting. Type the modification you wish to make")
        print("\tfirst name?")
        firstname= input()
        print("\tlast name?")
        lastname= input()
        username= firstname.lower()+lastname.lower()
        print("\tpassword name?")
        password= input()
        data = {"username": usr, "pwd": pwd, "EmployeeFirstname": firstname, "Lastname":lastname,
                "EmployeeUsrname": username, "EmployeeHashword":password}
        make_post_call('http://localhost:3000/api/employees/', data)
    elif actionType == "put":
        print("\tputting. target ID?")
        tgtID= input()
        print("\tattribute to modify?")
        tgtAttrib= input()
        print("\tnew value?")
        tgtVal= input()
        data = {"username": usr, "pwd": pwd, tgtAttrib: tgtVal, "EmployeeID": tgtID}
        make_put_call('http://localhost:3000/api/employees/'+tgtID, data)
    elif actionType == "delete":
        print("\tdeleting. Type ID to delete")
        tgtID= input()
        data = {"username": usr, "pwd": pwd, "EmployeeID": tgtID}
        make_delete_call('http://localhost:3000/api/employees/'+tgtID, data)

def testSequence():
    # testing get calls
    print("Making a get (read) call to employees")
    usr = "lukeskywalker"
    pwd = "test"
    data = {"username": usr, "pwd": pwd}
    print("sending:")
    print(data)
    make_get_call('http://localhost:3000/api/employees/', data)

    # usr = "lukeskywalker"
    # data = {"username": usr, "pwd": pwd}
    # print("sending:")
    # print(data)
    # make_get_call('http://localhost:3000/api/employees/', data)

    # print("\nMaking a get (read) call to a specific restaurant (id=30075445)")
    # make_get_call('http://localhost:3000/api/employees/1')
    #
    # print("\nMaking a post (create) call")
    # restaurant_data = {{"Auth": {"username" : "", "pwd" : ""}, "EmployeeFirstname": "Bill", "EmployeeLastname": "Heder", "EmployeeUsrname": "billheder"}
    # make_post_call('http://localhost:3000/api/employees/', restaurant_data)

    # print("\nMaking a put (update) call")
    # restaurant_data = {"RestaurantName": "This is a new name", "Boro": "Queens"}
    # make_put_call('http://localhost:3000/api/employees/1', restaurant_data)
    #
    # print("\nMaking a delete call to employees")
    # make_delete_call('http://localhost:3000/api/employees/1')


if __name__ == '__main__':

    keepGoing = True
    loggedIn = False
    username = ""
    password = ""
    while keepGoing:
        if loggedIn:
            print("logged in as "+ username)
            if not handleInput(username, password):
                print("shutting down")
                quit(0)
        else:
            print("type username and password to log in") # login saves credentials for use in each query
            print("type /quit to quit or /test to test automatically")
            print("username:")
            username = input()
            if username[0] == "/":
                if username == "/quit":
                    print("shutting down")
                    quit(0)
                if username == "/test":
                    print("performing test sequence")
                    testSequence()
            else:
                print("password:")
                password = input()
                loggedIn = True



