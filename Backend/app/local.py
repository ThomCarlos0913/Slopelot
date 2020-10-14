import serial
import requests

ser = serial.Serial('COM3', 9600)

while True:
    try:
        #print(ser.readline().decode("utf-8"))
        data = ser.readline().decode("utf-8")
        data = str(data)[:-2]
        print(data)
        #http://aduinno.pythonanywhere.com/
        #http://aduinno.pythonanywhere.com/
        url = 'http://aduinno.pythonanywhere.com/post_sensor'
        payload = {'payload_raw':data}
        post = requests.post(url, json=payload)
        print("DONE")
    except:
        pass

ser.closed()