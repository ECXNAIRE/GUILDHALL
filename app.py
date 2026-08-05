from flask import Flask, render_template, redirect, session, request, jsonify
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import requests
from database.initDB import insertUser, getUser, getUserName, updateProfile, updatePoints, getUserWithUserID
from database.quest import saveQuest, getQuests, getQuestByID, getMyQuest, updatePledgedTo, updateStatus, deleteQuest, getActiveQuests, getCompletedCount, getQuestCounts
import json
from database.pledges import savePledges, getPledgesByQuestId, updatePledgeStatus, getMyPledges, deleteAll, deletePledge, getPledgesCount
from database.notifications import insertNotices, getNotice,updateNotification, getUnreadNotificationsCount, clearNotifications


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

    providerID = session["userDetails"]["provider_id"]
    userDetails = getUser(providerID)

    userID = userDetails["user_id"]

    return render_template(
        "mainPage.html",
        user=userDetails,
        unreadCount=getUnreadNotificationsCount(userID)
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

    username = getUserName(userID)

    saveQuest(title, description, difficulty, tags, username, guild, userID)
    print(title, description, difficulty, tags, username, guild)

    return jsonify({
        "success": True
    })



@app.route("/getQuest/<guild>")
def getQuest(guild):

    quests = getQuests(guild)

    return jsonify(quests)


@app.route("/profilePage", methods = ['GET', 'POST'])
def profilePage():
    if request.method == "POST":

        data = request.get_json()
        username = data["username"]
        bio = data["userBio"]
        github = data["github"]
        linkedIn = data["linkedIn"]
        discord = data["discord"]
        skills = json.dumps(data["skills"])

        userId = session["userDetails"]["user_id"]

        updateProfile(username, bio, skills, discord, linkedIn, github, userId, )

        return jsonify({"success": True})


    if "userDetails" not in session:
        return redirect("/")

    providerId = session["userDetails"]["provider_id"]
    userDetails = getUser(providerId)
    userID = userDetails["user_id"]
    print(userID)

    pledgesCount = getPledgesCount(userID)
    questCount = getQuestCounts(userID)
    activeQuests = getActiveQuests(userID)
    completedQuest = getCompletedCount(userID)

    print(pledgesCount, questCount, activeQuests, completedQuest)



    return render_template(
        "profilePage.html",
        userProfile=userDetails,
        pledgesCount=pledgesCount,
        questCount=questCount,
        activeQuests=activeQuests,
        completedQuest=completedQuest
        )





@app.route("/pledges", methods=["POST"])
def pledges():
    if request.method == "POST":
        data = request.get_json()

        questID = data["questID"]
        pledgerID = data["pledgerID"]
        masterID = data["masterID"]

        success = savePledges(masterID, pledgerID, questID)
        quest = getQuestByID(questID)


        questTitle = quest[1]
        body = body = (
                f"<strong>{pledgerID}</strong> has pledged to undertake "
                f"<strong>{questTitle}</strong>. Review their profile before "
                f"deciding whether to Grant or Decline their pledge."
            )

        title = "Pledge Received"
                    
        insertNotices(masterID, title, body, "pledge")
        
        return jsonify({
            "success": success
        })




@app.route("/notificationPage")
def noticePage():
    notices = getNotice(session["userDetails"]["user_id"])

    updateNotification(session["userDetails"]["user_id"])


    return render_template(
        "notificationsPage.html",
        notices=notices
    )




@app.route("/myQuest", methods=["POST"])
def myQuest():
    data = request.get_json()

    userID = data["userID"]

    quests = getMyQuest(userID)

    return jsonify(quests)





@app.route("/viewQuest/<questID>")
def viewQuest(questID):
    print(questID)

    quest = getQuestByID(questID)
    pledges = getPledgesByQuestId(questID)
    

    return render_template(
        "myQuestPage.html",
        quest = quest,
        pledges = pledges)



@app.route("/acceptedPledge", methods=["POST"])
def acceptedPledge():
    data = request.get_json()

    questID = data["questID"]
    pledgerID = data["pledgerID"]
    questTitle = data["questTitle"]


    title= "Pledge Accepted"

    body = f"Your pleadge for {questTitle}, Quest ID: {questID} has been accepted,"


    insertNotices(pledgerID, title, body, "pledgeAccepted" )
    updatePledgeStatus(questID, "ACCEPTED")
    updateStatus(questID, "PLEDGED")
    updatePledgedTo(questID, pledgerID)
    deleteAll(questID)

    return jsonify({"success": True})



@app.route("/rejectedPledge", methods=["POST"])
def rejectedPledge():
    data = request.get_json()

    questID = data["questID"]
    pledgerID = data["pledgerID"]
    questTitle = data["questTitle"]

    title = "Pledge Rejected"

    body = f"Your pleadge for {questTitle}, Quest ID: {questID} has been rejected,"

    insertNotices(pledgerID, title, body, "pledgeRejected" )
    updatePledgeStatus(questID, "REJECTED")
    deletePledge(questID, pledgerID)

    return jsonify({"success": True})





@app.route("/myPledges", methods=["POST"])
def mypledges():
    data = request.get_json()

    userID = data["userID"]

    pledges = getMyPledges(userID)

    result = []

    for pledge in pledges:
        questID = pledge[0]

        quest= getQuestByID(questID)

        if quest is None:
                    continue

        questTitle = quest[1]

        result.append({
            "pledge": pledge,
            "questTitle": questTitle
        })

    return jsonify(result)




@app.route("/toggleQuestStatus", methods=["POST"])
def toggleQuestStatus():
    data = request.get_json()
    questID = data["questID"]
    status = data["status"]

    updateStatus(questID, status)


    return jsonify({
        "success": True
    })




@app.route("/deleteQuest", methods=["POST"])
def questDeletion():
    data = request.get_json()

    questID = data["questID"]

    deleteQuest(questID)
    deleteAll(questID)

    return jsonify({
            "success": True
        })
    


@app.route("/completedQuest", methods=["POST"])
def completedQuest():
    data = request.get_json()

    questID = data["questID"]
    pledgerID = data["pledgedTo"]
    difficulty = data["difficulty"]


    if difficulty == "LOW":
        points = 10
    elif difficulty == "MEDIUM":
        points = 25
    elif difficulty == "HARD":
        points = 50
    elif difficulty == "LEGENDARY":
        points = 100

    updateStatus(questID, "COMPLETED")

    print(type(pledgerID))

    updatePoints(pledgerID, points)

    return jsonify({
        "success": True
    })





@app.route("/viewProfile/<userID>")
def viewProfile(userID):
    user = getUserWithUserID(userID)
    
    pledgesCount = getPledgesCount(userID)
    questCount = getQuestCounts(userID)
    activeQuests = getActiveQuests(userID)
    completedQuest = getCompletedCount(userID)

    return render_template(
        "viewprofilePage.html",
        user=user,
        pledgesCount=pledgesCount,
        questCount=questCount,
        activeQuests=activeQuests,
        completedQuest=completedQuest
    )




@app.route("/clearNotices", methods=["POST"])
def clearNotices():

    data = request.get_json()

    userID = data["userID"]

    clearNotifications(userID)

    return jsonify({
        "success": True
    })
if (__name__) == "__main__":
    app.run(debug=True)

    