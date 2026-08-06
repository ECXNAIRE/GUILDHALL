import sqlite3
from helpers.questID import generateQuestId
import os




BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "database.db")

def createQuestTable():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quests (
    quest_id TEXT UNIQUE,
    title TEXT,
    description TEXT,
    difficulty TEXT,
    tags TEXT,
    guild TEXT,
    creator TEXT,
    creator_id TEXT,
    status TEXT,
    pledged_to TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

    """)


    conn.commit()
    conn.close()


def saveQuest(title, description, difficulty, tags, creator, guild, userID):
    createQuestTable()
    quest_id = generateQuestId()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(""" 
    INSERT INTO quests (quest_id, title, description, difficulty, tags, creator, guild, creator_id, status, pledged_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (quest_id, title, description, difficulty, tags, creator, guild, userID, "AVAILABLE", None))

    conn.commit()
    conn.close()



def getQuests(guild):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()


    cursor.execute("""
    SELECT * FROM quests WHERE guild = ?
    """, (guild,))

    quest = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return quest



def getQuestByID(questID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM quests WHERE quest_id = ?
    """, (questID,))

    quest = cursor.fetchone()

    conn.close()

    return quest




def getMyQuest(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("""
    SELECT * FROM quests WHERE creator_id = ?
    """, (userID,))


    quests = cursor.fetchall()

    return quests




def updateStatus(questID, status):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("""
    UPDATE quests SET status = ? WHERE quest_id = ?
    """, (status, questID))

    conn.commit()
    conn.close()




def updatePledgedTo(questID, pledgerID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE quests SET pledged_to = ? WHERE quest_id = ? 
    """, (pledgerID, questID))

    conn.commit()
    conn.close()



def deleteQuest(questID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    DELETE FROM quests
    WHERE quest_id = ?
    """, (questID,))

    conn.commit()
    conn.close()



def getQuestCounts(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("""
    SELECT COUNT(*) FROM quests WHERE creator_id = ?
    """, (userID,))


    questCount = cursor.fetchone()[0]

    conn.close()
    return questCount



def getCompletedCount(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT COUNT(*) from quests WHERE pledged_to = ? AND status = ?
    """, (userID, "COMPLETED"))

    completedCount = cursor.fetchone()[0]

    conn.close()
    return completedCount




def getActiveQuests(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    SELECT COUNT(*) FROM quests WHERE pledged_to = ? AND status = ?
    """, (userID, "PLEDGED"))

    activeQuest = cursor.fetchone()[0]

    conn.close()
    return activeQuest
