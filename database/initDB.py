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
    email TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)


    conn.commit()
    conn.close()




def insertUser(email, provider, providerID, avatar):
    user = checkUserID(providerID)

    if user is None:
        initTable()
        userID = generateUserId(providerID)

        conn = sqlite3.connect("database/database.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO users (email, provider, provider_id, user_id, avatar)
        VALUES (?, ?, ?, ?, ?)
        """, (email, provider, providerID, userID, avatar))


        conn.commit()
        conn.close()

        return

