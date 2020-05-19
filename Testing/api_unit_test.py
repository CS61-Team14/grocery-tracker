import requests
import json

'''
Unit Testing for grocery-tracker project
Author: Ted G, Dartmouth CS61, Spring 2020
Group 14: Ted G, Nina P, Rodrigo CB, Anders L
Requires installation of mysql connector: pip install mysql-connector-python
	also requires Requests: pip install requests
Based on: https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html
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

    testSequence()



