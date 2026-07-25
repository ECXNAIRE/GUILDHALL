from flask import Flask, render_template, redirect, session
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
load_dotenv()

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)



@app.route('/')
def landingPage():
    return render_template("landingPage.html")


@app.route("/login")
def login():
    return google.authorize_redirect(
        "http://127.0.0.1:5000/login/callback"
    )

@app.route("/login/callback")
def callback():

    token = google.authorize_access_token()
    user = token["userinfo"]
    session["user"] = user
    return redirect("/main")





    
@app.route('/main')
def mainPage():
    if "user" not in session:
        return redirect("/")
    return render_template(
        "mainPage.html",
        user=session["user"]
        )





if (__name__) == "__main__":
    app.run(debug=True)
    