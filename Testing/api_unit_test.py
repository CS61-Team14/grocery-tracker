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

DEFAULT_TGT_URL = "http://localhost:3306/api"
CUSTOM_URL_FLAG = False


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
    data={
        "UserID": "1",
        "UserName": "'Bill Nye'",
        "UserEmail": "'billnye@scienceguy.com'",
        "UserPassword": "'TMinus10Seconds'"
     }
    resp = requests.put(url + "/users/new", json= data)
    if resp.text== "{\"status\":201,\"error\":null,\"response\":{\"fieldCount\":0,\"affectedRows\":1,\"insertId\":0,\"serverStatus\":2,\"warningCount\":0,\"message\":\"\",\"protocol41\":true,\"changedRows\":0}}":
        print("\tinsertion succeeded")
        return True
    else:
        print("\t" + resp.text)
        return False
    # if resp.json()['status'] != 200:
    #     return false

def delete_dummy_users(url):
    data= {
        "UserID": "1"
    }
    resp= requests.delete(url+"/users/delete", json= data)
    if resp.text== "{\"status\":200,\"error\":null,\"response\":{\"fieldCount\":0,\"affectedRows\":1,\"insertId\":0,\"serverStatus\":2,\"warningCount\":0,\"message\":\"\",\"protocol41\":true,\"changedRows\":0}}":
        print("\tdeletion succeeded")
        return True
    else:
        print("\t"+resp.text)
        return False

def get_dummy_user(url):
    data= {
        "TgtUser": "-1"
    }
    resp= requests.get(url+"/users/get", json= data)
    print("\t" + resp.text)

def update_dummy_user(url):
    data= {
        "TgtUserID": "1",
        "TgtUserName": "Will Nye",
        "TgtUserEmail": "'billnye@scienceguy.org'",
        "TgtUserPassword": "'InertiaPropertyOfMatter'"
    }
    resp1= requests.post(url+"/users/update/username", json= data)
    # print("\t"+resp1.text)
    resp2= requests.post(url+"/users/update/email", json= data)
    # print("\t"+resp2.text)
    resp3= requests.post(url+"/users/update/password", json= data)
    # print("\t"+resp3.text)

def create_dummy_products(url):
    bread= {
        "UserID": "1",
        "ProductID": "-1",
        "ProductName": "'Bread'",
        "ProductDaysPerWidget": "3"
    }
    eggs= {
        "UserID": "1",
        "ProductID": "-2",
        "ProductName": "'Eggs'",
        "ProductDaysPerWidget": "12"
    }
    milk= {
        "UserID": "1",
        "ProductID": "-3",
        "ProductName": "'Milk'",
        "ProductDaysPerWidget": "8"
    }
    resp1= requests.put(url+"/products/new", json= bread)
    resp1a= requests.put(url+"/inventory/new", json= bread)
    resp2= requests.put(url+"/products/new", json= eggs)
    resp2a= requests.put(url+"/inventory/new", json= eggs)
    resp3= requests.put(url+"/products/new", json= milk)
    resp3a= requests.put(url+"/inventory/new", json= milk)
    print("\t"+resp1.text)
    print("\t"+resp1a.text)
    print("\t"+resp2.text)
    print("\t"+resp2a.text)
    print("\t"+resp3.text)
    print("\t"+resp3a.text)

def delete_dummy_products(url):
    bread= {
        "UserID": "1",
        "ProductID": "-1",
        "ProductName": "'Bread'",
        "ProductDaysPerWidget": "3"
    }
    resp2= requests.delete(url+"/inventory/delete", json= bread)
    resp1= requests.delete(url+"/products/delete", json= bread)

def update_dummy_products(url):
    bread= {
        "UserID": "1",
        "ProductID": "-1",
        "ProductName": "'Breadiness'",
        "ProductDaysPerWidget": "4"
    }
    resp1= requests.post(url+"/products/update/name", json= bread)
    resp2= requests.post(url+"/products/update/dpw", json= bread)
    print("\t"+resp1.text)
    print("\t"+resp2.text)

def create_dummy_store(url):
    data= {
        "UserID": "1",
        "StoreID": "-10",
        "StoreName": "Vendomart",
        "StoreStreetNum": "9999",
        "StoreStreet": "Dummy Street",
        "StoreCity": "Teston",
        "StoreZIP": "99999"
    }
    resp1= requests.put(url+"/stores/new", json= data)
    resp2= requests.put(url+"/stores/newUser", json= data)
    print("\t"+resp1.text)
    print("\t"+resp2.text)

# def get_dummy_store(url):
#     data= {
#         "UserID": "1",
#         "StoreID": "-10",
#         "StoreName": "Vendomart",
#         "StoreStreetNum": "9999",
#         "StoreStreet": "Dummy Street",
#         "StoreCity": "Teston",
#         "StoreZIP": "99999"
#     }
#     resp= requests.get(url+)

def update_dummy_store(url):
    data= {
        "UserID": "1",
        "StoreID": "-10",
        "StoreName": "Vendiplaza",
        "StoreStreetNum": "9991",
        "StoreStreet": "Clueless Way",
        "StoreCity": "Testville",
        "StoreZIP": "99991"
    }
    resp1= requests.post(url+"/stores/update/name", json= data)
    resp2= requests.post(url+"/stores/update/address", json= data)
    print("\t"+resp1.text)
    print("\t"+resp2.text)

def create_storeProducts_relation(url):
    data= {
        "ProductID": "-1",
        "StoreID": "-10"
    }
    resp= requests.put(url+"/storeProducts/new", json= data)
    print("\t"+resp.text)

def test_api_running(url):
    print("\ttesting local connection")
    resp = requests.get(url)
    # print("\t\t"+resp.text)
    if resp.text == "Hello, you've reached my API without calling anything. Sup?":
        print("\tlocal api is running")
        return True
    else:
        print("\tapi not found!")
        return False

def test_api_server_connection(url):
    print("\ttesting connection to server")
    resp = requests.get(url + "/products")
    if resp.text == "{\"status\":200,\"error\":null,\"response\":[]}":
        print("\tapi connected to server")
        return True
    else:
        print("\tprobably api-server error:")
        print("\t\t" + resp.text)

def get_shopping_list(url):
    data = {
        "UserID": "1"
    }
    resp = requests.get(url + "/shoppingList", json=data)
    print("\t"+resp.text)
    data = {
        "UserID": "1",
        "StoreID": "-10"
    }
    resp = requests.get(url + "/shoppingList", json=data)
    print("\t"+resp.text)
    data = {
        "UserID": "1",
        "StoreID": "-1"
    }
    resp = requests.get(url + "/shoppingList", json=data)
    print("\t"+resp.text)

def get_inventory(url):
    data = {
        "UserID": "1"

    }
    resp= requests.get(url + "/inventory/get", json= data)
    print("\t"+resp.text)

def what_is_sold_here(url):
    data= {
        "UserID": "1",
        "StoreID": "-10"
    }
    resp= requests.get(url + "/store/products")
    print("\t"+resp.text)

def where_is_this_sold(url):
    data= {
        "UserID": "1",
        "ProductID": "-1"
    }
    resp= requests.get(url+ "/products/store", json= data)
    print("\t"+resp.text)

# def get_user_stores(url):
#
# def get_user_products(url):

def test_shopping_list(url):
    data= {
        "UserID": "1",
        "": "",
    }

def delete_test(url):
    data = {
        "UserID": "1"
    }
    bread= {
        "UserID": "1",
        "ProductID": "-1",
        "ProductName": "'Bread'",
        "ProductDaysPerWidget": "3"
    }
    store= {
        "UserID": "1",
        "StoreID": "-10"
    }
    storeProducts= {
        "ProductID": "-1",
        "StoreID": "-10"
    }
    inventoryDel= requests.delete(url+"/inventory/delete", json= bread)
    UHSDel= requests.delete(url+"/stores/deleteUser", json= store)
    sxpDel= requests.delete(url+"/storeProducts/delete", json= storeProducts)
    productsDel= requests.delete(url+"/products/delete", json= bread)
    usersDel = requests.delete(url + "/users/delete", json=data)
    storeDel= requests.delete(url+"/stores/delete", json= store)
    sxpDel= requests.delete(url+"/storeProducts/delete", json= storeProducts)

    print("\t"+inventoryDel.text)
    print("\t"+UHSDel.text)
    print("\t"+sxpDel.text)
    print("\t"+productsDel.text)
    print("\t"+usersDel.text)
    print("\t"+storeDel.text)


def testSequence(url):
    print("Beginning test sequence")

    print("\nBasic connection test")
    if not test_api_running(url): exit(2)
    if not test_api_server_connection(url): exit(3)

    print("\nI/O test")
    create_dummy_users(url)
    get_dummy_user(url)
    update_dummy_user(url)
    get_dummy_user(url)
    delete_dummy_users(url)

    print("\nProducts Test")
    create_dummy_users(url)
    create_dummy_products(url)
    update_dummy_products(url)

    print("\nStore Test")
    create_dummy_store(url)
    # get_dummy_store(url)
    update_dummy_store(url)
    create_storeProducts_relation(url)

    print("\nShopping List Test")
    get_shopping_list(url)

    print("\nInventory Test")
    get_inventory(url)
    where_is_this_sold(url)
    what_is_sold_here(url)

    print("\nShopping List Test")


    print("\nDelete Test")
    delete_test(url)

    print("\ntests not failed. Everything will be okay <3")

if __name__ == '__main__':

    if CUSTOM_URL_FLAG: tgtURL = input("enter target URL or use default:")
    else: tgtURL= ""
    if tgtURL == "":
        tgtURL = DEFAULT_TGT_URL
    testSequence(tgtURL)
