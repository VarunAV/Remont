from database import db, Users
from flask_sqlalchemy import SQLAlchemy
import json

def addUsers(data):
    recieved = data
    print data
    u1 = recieved['username']
    u2 = recieved['password']
    u3 = recieved['mobile']
    users = Users(u1, u2, u3)
    db.session.add(users)
    db.session.commit()
