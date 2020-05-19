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

DEFAULT_TGT_URL= "http://localhost:3306"


# def make_get_call(url, data):
#     # make get call to url
#     resp = requests.get(url, json= data)
#     # expecting to get a status of 200 on success
#     if resp.json()['status'] != 200:
#         # This means something went wrong.
#         print('Something went wrong {}'.format(resp.status_code))
#         exit()
#     # print data returned
#     print("get succeeded")
#     print("received: ")
#     print(resp.json())
#     # for employee in resp.json()['response']:
#     #     print(employee["EmployeeID"], employee["EmployeeLastname"], employee["AdminPrivileges"])
#
# def make_post_call(url, data):
#     # make post call to url passing it data
#     resp = requests.post(url, json=data)
#     # expecting to get a status of 201 on success
#     if resp.json()['status'] != 201:
#         print('Something went wrong {}'.format(resp.status_code))
#         exit()
#     print('post succeeded')
#     print("received: ")
#     print(resp.json())
#
#
# def make_put_call(url, data):
#     # make post call to url passing it data
#     # structure this as such: "EmployeeFirstName= 'Bill'"
#     # one field at a time
#     resp = requests.put(url, json=data)
#     # expecting to get a status of 200 on success
#     if resp.json()['status'] != 200:
#         print('Something went wrong {}'.format(resp.status_code))
#         exit()
#     print('put succeeded')
#     print("received: ")
#     print(resp.json())
#
#
# def make_delete_call(url):
#     # make post call to url passing it data
#     resp = requests.delete(url)
#     # expecting to get a status of 200 on success
#     if resp.json()['status'] != 200:
#         print('Something went wrong {}'.format(resp.status_code))
#         exit()
#     print('delete succeeded')
#     print("received: ")
#     print(resp.json())

def create_dummy_users(url):
    resp= requests.put(url+"/users/new", )

def test_api_running(url):
    print("\ttesting local connection")
    resp= requests.get(url)
    # print("\t\t"+resp.text)
    if resp.text== "Hello, you've reached my API without calling anything. Sup?":
        print("\tlocal api is running")
        return True
    else:
        print("\tapi not found!")
        return False

def testSequence(url):
    print("Beginning test sequence")
    if not test_api_running(url):
        exit(2)

if __name__ == '__main__':

    tgtURL= input("enter target URL or use default:")
    if tgtURL== "":
        tgtURL= DEFAULT_TGT_URL
    testSequence(tgtURL)



