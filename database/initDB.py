import sqlite3
from helpers.userID import generateUserId
from helpers.checkUser import checkUserID

conn = sqlite3.connect("database/database.db")
cursor = conn.cursor()


def initTable():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT UNIQUE PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)


    conn.commit()
    conn.close()




def insertUser(email, provider, providerID, avatar):
    initTable()
    user = checkUserID(providerID)

    if user is None:
        userID = generateUserId(providerID)
        username = userID

        conn = sqlite3.connect("database/database.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO users (email, provider, provider_id, user_id, avatar, user_name)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (email, provider, providerID, userID, avatar, username))


        conn.commit()
        conn.close()

        return



def getUser(providerID):
    conn = sqlite3.connect("database/database.db")
    
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE provider_id = ?",( providerID,))
    user = cursor.fetchone()

    conn.close()
    return dict(user)


