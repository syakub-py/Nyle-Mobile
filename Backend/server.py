import json
from flask import Flask, jsonify
import pandas as pd

#todo:
#   1. add auth
#   2. add user class
#   3. create database connection 

app = Flask(__name__)
app.secret_key = 'BAD_SECRET_KEY'

def readJson(filename):
    file = open(filename, "r", encoding='utf-8')
    fileContents = file.read()
    FileContents = "["+fileContents+"]"
    return FileContents


@app.route("/getPosts",methods = ["GET", "POST"])
def getPosts():
    return jsonify(readJson('Backend/Data/posts.json'))

@app.route("/connectDatabase",methods = ["GET", "POST"])
def connectDatabase():
    return "connect to database here"




if '__main__' == __name__:
    app.run(host = "192.168.238.115", port=3000)