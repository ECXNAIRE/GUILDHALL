import sqlite3


def createQuestTable():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quests (
    title TEXT,
    description TEXT,
    difficulty TEXT,
    tags TEXT,
    guild TEXT,
    creator TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

    """)


    conn.commit()
    conn.close()


def saveQuest(title, description, difficulty, tags, creator, guild):
    createQuestTable()
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute(""" 
    INSERT INTO quests (title, description, difficulty, tags, creator, guild)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (title, description, difficulty, tags, creator, guild))

    conn.commit()
    conn.close()



def getQuests(guild):
    conn = sqlite3.connect("database/database.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()


    cursor.execute("""
    SELECT * FROM quests WHERE guild = ?
    """, (guild,))

    quest = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return quest


