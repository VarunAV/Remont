from flask import Flask, render_template, send_file, jsonify
from flask import request, abort, redirect
from flask_sqlalchemy import SQLAlchemy
import sqlite3, json, helper, hashlib, uuid
from database import db, Users

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/login",methods = ["POST"])
def login():
    data = json.loads(request.data)
    username = data['username']
    password = data['password']
    if username == 'admin' and password == 'admin':
        return 'True'
    else:
        res = db.engine.execute('select password from USERS where username == ?', (username,))
        data2 = [dict(r) for r in res]
        if len(data2) == 1:
            whole = data2[0]['password']
            temp,salt = whole.split(":")
            if temp == hashlib.md5(salt.encode() + password.encode()).hexdigest():
                return 'True'
            else:
                return 'False'
        else:
            return 'False'

@app.route("/signup",methods = ["POST"])
def signup():
    data = json.loads(request.data)
    print data
    password = data['password']
    mobile = data['mobile']
    res = db.engine.execute('select * from USERS where mobile == ?', (mobile,))
    res = [dict(r) for r in res]
    print res
    print len(res)
    if len(res) == 0:
        salt = uuid.uuid4().hex
        password = hashlib.md5(salt.encode()+password.encode()).hexdigest()+":"+salt
        data['password'] = password
        helper.addUsers(data)
        return 'Successful'
    else:
        return 'Invalid mobile number'

@app.route('/get_user', methods = ['POST'])
def get_user():
    username = request.data
    res = db.engine.execute('select * from USERS where username == ?', (username,))
    data = json.dumps([dict(r) for r in res])
    return data

@app.route('/set_userLeaves', methods = ['POST'])
def get_userLeaves():
    data = json.loads(request.data)
    print data
    username = data['username']
    leaves = data['leaves']
    print username, leaves
    res1 = db.engine.execute('UPDATE USERS SET leaves == ? WHERE username == ?', (leaves, username,))
    res = db.engine.execute('select * from USERS WHERE username == ?', (username,))
    print res
    data = json.dumps([dict(r) for r in res])
    print data
    return data
