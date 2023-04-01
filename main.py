from flask import Flask, render_template, request, session
import json, os

def basic_setup():
    total_dir = os.listdir()
    if "currentFiles" not in total_dir:
        os.mkdir("currentFiles")
basic_setup()

app = Flask(__name__, template_folder=os.getcwd()+"\\templates", static_folder=os.getcwd()+"\\static")
app.secret_key = "222SKK3JNNSOX0"

@app.route("/")
def home():
    session["writeIN"] = None
    return render_template("index.html")

@app.route("/createFile", methods=["POST"])
def createFile():
    meta_data_ = json.loads(request.data.decode())
    with open(f"currentFiles/{meta_data_['name']}", "wb") as fp:
        fp.close()
    session["writeIN"] = meta_data_['name']
    return "OK"

@app.route("/writeFile", methods=["POST"])
def writeFile():
    with open(f"currentFiles/{session['writeIN']}", "ab") as fp:
        fp.write(request.data)
    return "OK"


@app.route("/listDownloadable", methods=["POST"])
def list_Downloadable():
    session["writeIN"] = None
    to_ret = {"files": os.listdir("currentFiles/")}
    return json.dumps(to_ret)

@app.route("/downloadFile", methods=["POST"])
def downloadFile():
    file_info = json.loads(request.data.decode())
    with open(f"currentFiles/{file_info['name']}", "rb") as fp:
        return fp.read()

app.run(host="0.0.0.0", port=8080)