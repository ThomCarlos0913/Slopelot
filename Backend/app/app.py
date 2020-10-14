###################################################################
# @Author: ADUInno
# Copyright © 2020
###################################################################
from flask import Flask, request, jsonify
from flask.cli import FlaskGroup
from datetime import datetime
from flask_cors import CORS
from sqlalchemy import and_
from io import StringIO
from models import *
import pandas as pd
import base64
import serial
import click
import math
import csv
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = Configuration.SQLALCHEMY_DATABASE_URI
db.init_app(app)
CORS(app)

# Format Variables
probe_dict = {'0': '1', '1': '2', '2': '3'}
negative_dict = {'C': 1, 'D': -1}

# Routes section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
@app.route("/", methods=['GET'])
def test():
    return """ <h1>Hello ADUINNO!</h1>
                <ul>
                    <li>CAADYANG, MARK NOE CHRISTIAN P.</li>
                    <li>CARLOS, JOHN THOMAS</li>
                    <li>CUARESMA, DEXTER JAMES L.</li>
                    <li>VILLEGAS, MARC GREGG M.</li>
                </ul>

                updated as of 10:59am Aug 17 2020"""


@app.route('/get_accel_rotation1', methods=['GET'])
def get_accel_rotation1():
    module = request.args.get('mod')

    if module == '1':
        moisture_table_data = Module1.query.all()
    elif module == '2':
        moisture_table_data = Module2.query.all()
    elif module == '3':
        moisture_table_data = Module3.query.all()
    else:
        moisture_table_data = Module1.query.all()

    moisture_data = {}
    data_list = []

    for data in moisture_table_data:
        moisture_data[data.id] = {
            'accel1x': data.accel1x,
            'accel1y': data.accel1y,
            'accel1z': data.accel1z,
            'soil1': data.soil1,
            'accel2x': data.accel2x,
            'accel2y': data.accel2y,
            'accel2z': data.accel2z,
            'soil2': data.soil2,
            'accel3x': data.accel3x,
            'accel3y': data.accel3y,
            'accel3z': data.accel3z,
            'soil3': data.soil3,
        }
        data_list.append(moisture_data[data.id])

    data = data_list[-1]
    print(data, "<<<<<<<<<")

    roll1 = math.atan(data['accel1y'] / math.sqrt((data['accel1x']**2)  + (data['accel1z']**2) ))  * 180 / math.pi
    pitch1 =  math.atan(-1* data['accel1x'] / math.sqrt((data['accel1y']**2)+ (data['accel1z']**2))) * 180 / math.pi
    roll1 = (roll1+90)*3/180+0;
    pitch1 = (pitch1+90)*3/180+0;

    roll2 = math.atan(data['accel2y'] / math.sqrt((data['accel2x']**2)  + (data['accel2z']**2) ))  * 180 / math.pi
    pitch2 =  math.atan(-1* data['accel2x'] / math.sqrt((data['accel2y']**2)+ (data['accel2z']**2))) * 180 / math.pi
    roll2 = (roll2+90)*3/180+0;
    pitch2 = (pitch2+90)*3/180+0;

    roll3 = math.atan(data['accel3y'] / math.sqrt((data['accel3x']**2)  + (data['accel3z']**2) ))  * 180 / math.pi
    pitch3 =  math.atan(-1* data['accel3x'] / math.sqrt((data['accel3y']**2)+ (data['accel3z']**2))) * 180 / math.pi
    roll3 = (roll3+90)*3/180+0;
    pitch3 = (pitch3+90)*3/180+0;

    return jsonify({'roll1': roll1, 'pitch1': pitch1, 'roll2': roll2, 'pitch2': pitch2, 'roll3': roll3, 'pitch3': pitch3})


@app.route("/post_sensor", methods=['POST'])
def post_sensor():
    payload = request.get_json()
    sensor_value = payload.get('payload_raw', None)
    hex_value = sensor_value #(str(base64.b64decode(sensor_value).hex())).upper()

    # Place Values
    a1x = negative_dict[hex_value[0]] * float(hex_value[1:4] + "." + hex_value[4:6])
    a1y = negative_dict[hex_value[6]] * float(hex_value[7:10] + "." + hex_value[10:12])
    a1z = negative_dict[hex_value[12]] * float(hex_value[13:16] + "." + hex_value[16:18])
    s1 = negative_dict[hex_value[18]] * float(hex_value[19:22] + "." + hex_value[22:24])
    a2x = negative_dict[hex_value[24]] * float(hex_value[25:28] + "." + hex_value[28:30])
    a2y = negative_dict[hex_value[30]] * float(hex_value[31:34] + "." + hex_value[34:36])
    a2z = negative_dict[hex_value[36]] * float(hex_value[37:40] + "." + hex_value[40:42])
    s2 = negative_dict[hex_value[42]] * float(hex_value[43:46] + "." + hex_value[46:48])
    a3x = negative_dict[hex_value[48]] * float(hex_value[49:52] + "." + hex_value[52:54])
    a3y = negative_dict[hex_value[54]] * float(hex_value[55:58] + "." + hex_value[58:60])
    a3z = negative_dict[hex_value[60]] * float(hex_value[61:64] + "." + hex_value[64:66])
    s3 = negative_dict[hex_value[66]] * float(hex_value[67:70] + "." + hex_value[70:71])

    # Post Sensor Data
    if hex_value[-2:] == 'AA':
        new_sensor_reading = Module1(s_accel1x=a1x, s_accel1y=a1y, s_accel1z=a1z, s_soil1=s1, s_accel2x=a2x, s_accel2y=a2y, s_accel2z=a2z,
                                         s_soil2=s2, s_accel3x=a3x, s_accel3y=a3y, s_accel3z=a3z, s_soil3=s3, s_stamp_datetime=datetime.now())
        #new_log = Log('Data from Module 1 was fetched and stored on the database', datetime.now())
    if hex_value[-2:] == 'BB':
        new_sensor_reading = Module2(s_accel1x=a1x, s_accel1y=a1y, s_accel1z=a1z, s_soil1=s1, s_accel2x=a2x, s_accel2y=a2y, s_accel2z=a2z,
                                         s_soil2=s2, s_accel3x=a3x, s_accel3y=a3y, s_accel3z=a3z, s_soil3=s3, s_stamp_datetime=datetime.now())
        #new_log = Log('Data from Module 2 was fetched and stored on the database', datetime.now())
    if hex_value[-2:] == 'CC': 
        new_sensor_reading = Module3(s_accel1x=a1x, s_accel1y=a1y, s_accel1z=a1z, s_soil1=s1, s_accel2x=a2x, s_accel2y=a2y, s_accel2z=a2z,
                                         s_soil2=s2, s_accel3x=a3x, s_accel3y=a3y, s_accel3z=a3z, s_soil3=s3, s_stamp_datetime=datetime.now())
        #new_log = Log('Data from Module 3 was fetched and stored on the database', datetime.now())

    # Commit To Database
    db.session.add(new_sensor_reading)
    #db.session.add(new_log)
    db.session.commit()
    print("DONE")

    return "Uploaded to module"


@app.route('/get_logs', methods=['GET'])
def get_logs():
    log_query = Log.query.all()
    logs = {}
    data_logs = []
    for log in log_query:
        logs[log.id] = {
            'id': log.id,
            'entry': log.entry,
            'log_date': log.log_date
        }
        data_logs.append(logs[log.id])

    return jsonify(data_logs)


@app.route("/get_table_data", methods=['GET'])
def get_table_data():
    module = request.args.get('mod')
    time_modification = request.args.get('time')

    if time_modification == '1':
        start_date = request.args.get('start')
        end_date = request.args.get('end')

        if module == '1':
            moisture_table_data = Module1.query.filter(and_(Module1.stamp_datetime>=start_date, Module1.stamp_datetime<=end_date))
        if module == '2':
            moisture_table_data = Module2.query.filter(and_(Module2.stamp_datetime>=start_date, Module2.stamp_datetime<=end_date))
        if module == '3':
            moisture_table_data = Module3.query.filter(and_(Module3.stamp_datetime>=start_date, Module3.stamp_datetime<=end_date))
    else:
        if module == '1':
            moisture_table_data = Module1.query.all()
        if module == '2':
            moisture_table_data = Module2.query.all()
        if module == '3':
            moisture_table_data = Module3.query.all()

    moisture_data = {}
    data_list = []

    for data in moisture_table_data:
        moisture_data[data.id] = {
            'id': data.id,
            'accel1x': data.accel1x,
            'accel1y': data.accel1y,
            'accel1z': data.accel1z,
            'soil1': data.soil1,
            'accel2x': data.accel2x,
            'accel2y': data.accel2y,
            'accel2z': data.accel2z,
            'soil2': data.soil2,
            'accel3x': data.accel3x,
            'accel3y': data.accel3y,
            'accel3z': data.accel3z,
            'soil3': data.soil3,
            'time': data.stamp_datetime
        }

    return jsonify(moisture_data)

@app.route("/get_latest_data", methods=['GET'])
def get_soil_moisture():
    module = request.args.get("mod")

    if module == '1':
        moisture_table_data = Module1.query.all()
    elif module == '2':
        moisture_table_data = Module2.query.all()
    elif module == '3':
        moisture_table_data = Module3.query.all()
    else:
        moisture_table_data = Module1.query.all()

    moisture_data = {}
    data_list = []

    for data in moisture_table_data:
        moisture_data[data.id] = {
            'accel1x': data.accel1x,
            'accel1y': data.accel1y,
            'accel1z': data.accel1z,
            'soil1': data.soil1,
            'accel2x': data.accel2x,
            'accel2y': data.accel2y,
            'accel2z': data.accel2z,
            'soil2': data.soil2,
            'accel3x': data.accel3x,
            'accel3y': data.accel3y,
            'accel3z': data.accel3z,
            'soil3': data.soil3,
        }
        data_list.append(moisture_data[data.id])

    if not data_list:
        return jsonify({
            'accel1x': 0,
            'accel1y': 0,
            'accel1z': 0,
            'soil1': 10,
            'accel2x': 0,
            'accel2y': 0,
            'accel2z': 0,
            'soil2': 20,
            'accel3x': 0,
            'accel3y': 0,
            'accel3z': 0,
            'soil3': 30,
        })

    return jsonify(data_list[-1])


# General routines section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
@click.group(cls=FlaskGroup, create_app=lambda: app)
def cli():
    """Management script for the flask application."""
    pass


if __name__ == '__main__':
    cli()
