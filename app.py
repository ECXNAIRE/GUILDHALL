from flask import Flask, render_template, redirect, session, request, jsonify
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import requests
from database.initDB import insertUser, getUser
from database.quest import saveQuest
import json


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
    email = user["email"]
    provider = "google"
    avatar = user["picture"]
    providerID = user["sub"]

    insertUser(email, provider, providerID, avatar)
    userDetails = getUser(providerID)
    session["userDetails"] = userDetails


    print(email, provider, providerID)


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
    email = user["email"]
    provider = "github"
    providerID = str(user["id"])
    avatar = user["avatar_url"]
    insertUser(email, provider, providerID, avatar)
    userDetails = getUser(providerID)
    session["userDetails"] = userDetails



    return redirect("/main")





@app.route('/main')
def mainPage():
    if "userDetails" not in session:
        return redirect("/")
    userDetails = session["userDetails"]

    return render_template(
        "mainPage.html",
        user=userDetails
        )



@app.route("/createQuest", methods=["POST"])
def createQuest():
    data = request.get_json()

    title = data['title']
    description = data['description']
    tags = json.dumps(data["tags"])
    difficulty = data['difficulty']
    guild = data["guild"]
    userID = data["userID"]

    saveQuest(title, description, difficulty, tags, userID, guild)

    return jsonify({
        "success": True
    })



if (__name__) == "__main__":
    app.run(debug=True)
    