from flask import Flask, render_template, request
import json, os

def basic_setup():
    total_dir = os.listdir()
    if "currentFiles" not in total_dir:
        os.mkdir("currentFiles")
basic_setup()

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

writeIN = None
@app.route("/createFile", methods=["POST"])
def createFile():
    global writeIN
    meta_data_ = json.loads(request.data.decode())
    with open(f"currentFiles/{meta_data_['name']}", "wb") as fp:
        fp.close()
    writeIN = meta_data_['name']
    return "OK"

@app.route("/writeFile", methods=["POST"])
def writeFile():
    global writeIN
    with open(f"currentFiles/{writeIN}", "wb") as fp:
        fp.write(request.data)
    writeIN = None
    return "OK"


@app.route("/listDownloadable", methods=["POST"])
def list_Downloadable():
    to_ret = {"files": os.listdir("currentFiles/")}
    return json.dumps(to_ret)

@app.route("/downloadFile", methods=["POST"])
def downloadFile():
    file_info = json.loads(request.data.decode())
    with open(f"currentFiles/{file_info['name']}", "rb") as fp:
        return fp.read()

app.run(host="0.0.0.0", port=8080)