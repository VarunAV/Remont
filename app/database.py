from flask import Flask
from passlib.apps import custom_app_context as pwd_context
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/hackathon.db'
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'USERS'
    userid = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(100))
    mobile = db.Column(db.String(10))
    leaves = db.Column(db.Integer)

    def __init__(self, username, password, mobile):
        self.username = username
        self.password = password
        self.mobile = mobile
        self.leaves = 0

    def __repr__(self):
        return '<repr %r' % self.userid
