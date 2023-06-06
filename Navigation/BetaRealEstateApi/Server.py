from flask import Flask, request, jsonify
import pandas as pd
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

config = {
  'user': 'root',
  'password': 'ThisIsMysql101!',
  'host': 'localhost',
  'database': 'realestatedata_db',
  'connect_timeout': 60000
}

#ThisIsMysql101!
db = mysql.connector.connect(**config)

cursor = db.cursor()

#get address based on owner
@app.route('/api/getProperty/', methods = ['GET'])
def GetProperty():
    firstName = request.args.get("FirstName").upper().strip()
    lastName = request.args.get("LastName").upper().strip()
    cursor.execute("SELECT  * FROM realestatedata_db.acris_real_property_parties where NAME like '"+ lastName + ", " + firstName+"%' or NAME like '"+ lastName + "," + firstName+"%';")
    rows = cursor.fetchall()
    data = pd.DataFrame(rows, columns=['DOCUMENT ID', "RECORD TYPE", "PARTY TYPE", "NAME", "ADDRESS 1", "ADDRESS 2", "COUNTRY", "CITY", "STATE", "ZIP", "GOOD THROUGH DATE"])
   
    data.drop(data.columns[data.columns.str.contains('NAME',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('RECORD TYPE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('PARTY TYPE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('GOOD THROUGH DATE',case = False)],axis = 1, inplace = True)
   
    data = data[(data['ZIP'] != '') & (data['ZIP'] != '00000') & (data['ADDRESS 1'] != "")]
    
    return jsonify(data.drop_duplicates().dropna().to_dict(orient='records'))

#get owner based on address
@app.route('/api/getOwner/', methods = ['GET'])
def GetOwner():
    address = request.args.get("address").upper().strip()
    cursor.execute("SELECT  * FROM realestatedata_db.acris_real_property_parties where `ADDRESS 1` like '"+ address +"%';")

    rows = cursor.fetchall()
    data = pd.DataFrame(rows, columns=['DOCUMENT ID', "RECORD TYPE", "PARTY TYPE", "NAME", "ADDRESS 1", "ADDRESS 2", "COUNTRY", "CITY", "STATE", "ZIP", "GOOD THROUGH DATE"])
    data = data[(data['ZIP'] != '') & (data['ZIP'] != '00000') & (data['ADDRESS 1'] != "")]
 
    data.drop(data.columns[data.columns.str.contains('DOCUMENT ID',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('RECORD TYPE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('PARTY TYPE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('GOOD THROUGH DATE',case = False)],axis = 1, inplace = True)

    return jsonify(data.drop_duplicates().dropna().to_dict(orient='records'))

#gets the document info on a given record
@app.route('/api/getDocInfo/', methods = ['GET'])
def GetDocInfo():
    DocumentId = request.args.get("DocumentId").upper().strip()

    cursor.execute("SELECT  * FROM realestatedata_db.acris_real_property_master where DOCUMENT_ID = '"+DocumentId+"';")

    rows = cursor.fetchall()
    data = pd.DataFrame(rows, columns=['DOCUMENT ID', "RECORD TYPE", "CRFN", "BOROUGH","DOC_TYPE", "DOC_DATE", "DOC_AMOUNT", "RECORDED_FILED", "MODIFIED_DATE", "REEL_YEAR", "REEL_NBR", "REEL_PAGE", "PCT_TRANSFERRED", "GOOD_THROUGH_DATE"])
    data.drop(data.columns[data.columns.str.contains('RECORD TYPE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('BOROUGH',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('GOOD_THROUGH_DATE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('CRFN',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('REEL_YEAR',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('REEL_NBR',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('REEL_PAGE',case = False)],axis = 1, inplace = True)
    data.drop(data.columns[data.columns.str.contains('PCT_TRANSFERRED',case = False)],axis = 1, inplace = True)
    
    return jsonify(data.drop_duplicates().dropna().to_dict(orient='records'))

@app.route('/api/addRecord/', methods = ['POST'])
def AddRecord():
    owner =request.args.get("owner").upper().strip()
    address = request.args.get("address").upper().strip()
    cursor.execute("INSERT INTO realestatedata_db.acris_real_property_parties where `ADDRESS 1` like '"+ address +"%';")
    rows = cursor.fetchall()
    data = pd.DataFrame(rows, columns=['DOCUMENT ID', "RECORD TYPE", "PARTY TYPE", "NAME", "ADDRESS 1", "ADDRESS 2", "COUNTRY", "CITY", "STATE", "ZIP", "GOOD THROUGH DATE"])
   
    data = data[(data['ZIP'] != '') & (data['ZIP'] != '00000') & (data['ADDRESS 1'] != "")]

    return jsonify(data.drop_duplicates().dropna().to_dict(orient='records'))


if "__main__" == __name__:
    app.run(host='192.168.86.115', port=5000)