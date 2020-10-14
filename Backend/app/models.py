###################################################################
# @Author: ADUInno
# Copyright © 2020
###################################################################
from flask_sqlalchemy import SQLAlchemy
from config import Configuration

db = SQLAlchemy()


class Module1(db.Model):
    __tablename__ = Configuration.MODULE1
    id = db.Column('stamp_id', db.Integer, primary_key=True)
    accel1x = db.Column('accel1x', db.FLOAT)
    accel1y = db.Column('accel1y', db.FLOAT)
    accel1z = db.Column('accel1z', db.FLOAT)
    soil1 = db.Column('soil1', db.Integer)
    accel2x = db.Column('accel2x', db.FLOAT)
    accel2y = db.Column('accel2y', db.FLOAT)
    accel2z = db.Column('accel2z', db.FLOAT)
    soil2 = db.Column('soil2', db.Integer)
    accel3x = db.Column('accel3x', db.FLOAT)
    accel3y = db.Column('accel3y', db.FLOAT)
    accel3z = db.Column('accel3z', db.FLOAT)
    soil3 = db.Column('soil3', db.Integer)
    stamp_datetime = db.Column('stamp_datetime', db.DATE)

    def __init__(self, s_accel1x, s_accel1y, s_accel1z, s_soil1, s_accel2x, s_accel2y, s_accel2z,
                 s_soil2, s_accel3x, s_accel3y, s_accel3z, s_soil3, s_stamp_datetime):
        self.accel1x = s_accel1x
        self.accel1y = s_accel1y
        self.accel1z = s_accel1z
        self.soil1 = s_soil1
        self.accel2x = s_accel2x
        self.accel2y = s_accel2y
        self.accel2z = s_accel2z
        self.soil2 = s_soil2
        self.accel3x = s_accel3x
        self.accel3y = s_accel3y
        self.accel3z = s_accel3z
        self.soil3 = s_soil3
        self.stamp_datetime = s_stamp_datetime

class Module2(db.Model):
    __tablename__ = Configuration.MODULE2
    id = db.Column('stamp_id', db.Integer, primary_key=True)
    accel1x = db.Column('accel1x', db.FLOAT)
    accel1y = db.Column('accel1y', db.FLOAT)
    accel1z = db.Column('accel1z', db.FLOAT)
    soil1 = db.Column('soil1', db.Integer)
    accel2x = db.Column('accel2x', db.FLOAT)
    accel2y = db.Column('accel2y', db.FLOAT)
    accel2z = db.Column('accel2z', db.FLOAT)
    soil2 = db.Column('soil2', db.Integer)
    accel3x = db.Column('accel3x', db.FLOAT)
    accel3y = db.Column('accel3y', db.FLOAT)
    accel3z = db.Column('accel3z', db.FLOAT)
    soil3 = db.Column('soil3', db.Integer)
    stamp_datetime = db.Column('stamp_datetime', db.DATE)

    def __init__(self, s_accel1x, s_accel1y, s_accel1z, s_soil1, s_accel2x, s_accel2y, s_accel2z,
                 s_soil2, s_accel3x, s_accel3y, s_accel3z, s_soil3, s_stamp_datetime):
        self.accel1x = s_accel1x
        self.accel1y = s_accel1y
        self.accel1z = s_accel1z
        self.soil1 = s_soil1
        self.accel2x = s_accel2x
        self.accel2y = s_accel2y
        self.accel2z = s_accel2z
        self.soil2 = s_soil2
        self.accel3x = s_accel3x
        self.accel3y = s_accel3y
        self.accel3z = s_accel3z
        self.soil3 = s_soil3
        self.stamp_datetime = s_stamp_datetime

class Module3(db.Model):
    __tablename__ = Configuration.MODULE3
    id = db.Column('stamp_id', db.Integer, primary_key=True)
    accel1x = db.Column('accel1x', db.FLOAT)
    accel1y = db.Column('accel1y', db.FLOAT)
    accel1z = db.Column('accel1z', db.FLOAT)
    soil1 = db.Column('soil1', db.Integer)
    accel2x = db.Column('accel2x', db.FLOAT)
    accel2y = db.Column('accel2y', db.FLOAT)
    accel2z = db.Column('accel2z', db.FLOAT)
    soil2 = db.Column('soil2', db.Integer)
    accel3x = db.Column('accel3x', db.FLOAT)
    accel3y = db.Column('accel3y', db.FLOAT)
    accel3z = db.Column('accel3z', db.FLOAT)
    soil3 = db.Column('soil3', db.Integer)
    stamp_datetime = db.Column('stamp_datetime', db.DATE)

    def __init__(self, s_accel1x, s_accel1y, s_accel1z, s_soil1, s_accel2x, s_accel2y, s_accel2z,
                 s_soil2, s_accel3x, s_accel3y, s_accel3z, s_soil3, s_stamp_datetime):
        self.accel1x = s_accel1x
        self.accel1y = s_accel1y
        self.accel1z = s_accel1z
        self.soil1 = s_soil1
        self.accel2x = s_accel2x
        self.accel2y = s_accel2y
        self.accel2z = s_accel2z
        self.soil2 = s_soil2
        self.accel3x = s_accel3x
        self.accel3y = s_accel3y
        self.accel3z = s_accel3z
        self.soil3 = s_soil3
        self.stamp_datetime = s_stamp_datetime

class Log(db.Model):
    __tablename__ = Configuration.LOG
    id = db.Column('id', db.Integer, primary_key=True)
    entry = db.Column('entry', db.Text)
    log_date = db.Column('log_date', db.DATE)

    def __init__(self, g_entry, g_log_date):
        self.entry = g_entry
        self.log_date = g_log_date