import sqlite3
import random
import string



def generateUserId(provider_id):
    user = checkUserID(provider_id)

    if user is not None:
        return user[0]
    
    while True:
        newID = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))

        if not userIdExist(newID):
            return newID


def checkUserID(provider_id):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT  user_id FROM users WHERE provider_id = ?
    """, (provider_id,))

    user = cursor.fetchone()
    conn.close()
    return user



def userIdExist(userID):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT 1 FROM users WHERE user_id = ?", (userID,))
    exists = cursor.fetchone() is not None

    return exists