from flask import Flask, render_template, redirect, session, request
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import requests
from database.db import get_db


load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

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

github = oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={
        "scope": "read:user user:email"
    }
)


@app.route('/')
def landingPage():
    return render_template("landingPage.html")


@app.route("/googleLogin")
def googleLogin():
    return google.authorize_redirect(
        "http://127.0.0.1:5000/google/callback"
    )

@app.route("/google/callback")
def googleCallback():
    token = google.authorize_access_token()
    user = token["userinfo"]
    session["user"] = user
    return redirect("/main")


@app.route("/githubLogin")
def githubLogin():
    return github.authorize_redirect(
        "http://127.0.0.1:5000/github/callback"
    )


@app.route("/github/callback")
def githubCallback():
    token = github.authorize_access_token()
    user = github.get("user").json()
    session["user"] = user
    return redirect("/main")



@app.route("/hackclubLogin")
def hackclubLogin():
    params = {
        "client_id": os.getenv("HACKCLUB_CLIENT_ID"),
        "redirect_uri": "http://127.0.0.1:5000/hackclub/callback",
        "response_type": "code",
        "scope": "profile"
    }

    url = (
        "https://auth.hackclub.com/oauth/authorize?"
        + urlencode(params)
    )

    return redirect(url)


@app.route("/hackclub/callback")
def hackclubCallback():
    code = request.args.get("code")

    response = requests.post(
        "https://auth.hackclub.com/oauth/token",
        data={
            "client_id": os.getenv("HACKCLUB_CLIENT_ID"),
            "client_secret": os.getenv("HACKCLUB_CLIENT_SECRET"),
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://127.0.0.1:5000/hackclub/callback"
        },
        headers={
            "Accept": "application/json"
        }
    )

    token_data = response.json()

    return token_data





    
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
    