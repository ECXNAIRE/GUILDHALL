import sqlite3
import os




BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "database.db")



def pledgeTable():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pledges (
    quest_id TEXT,
    master_id TEXT,
    pledger_id TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


def savePledges(masterID, pledgerID, questID):
    pledgeTable()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("SELECT 1 FROM pledges WHERE pledger_id = ? AND quest_id = ?", (pledgerID, questID))

    if cursor.fetchone():
        conn.close()
        return False


    cursor.execute("""
    INSERT INTO pledges (quest_id, master_id, pledger_id, status)
    VALUES (?, ?, ?, ?)
    """, (questID, masterID, pledgerID, "PENDING"))

    conn.commit()
    conn.close()

    return True


def getPledgesByQuestId(questID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM pledges WHERE quest_id = ?
    """, (questID,))

    pledges = cursor.fetchall()

    return pledges





def updatePledgeStatus(questID, status):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE pledges SET status = ? WHERE quest_id =  ?
    """, (status, questID))


    conn.commit()
    conn.close()



def getMyPledges(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM pledges WHERE pledger_id = ?
    """, (userID,))


    pledges = cursor.fetchall()

    conn.close()

    return pledges




def deletePledge(questID, pledgerID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    cursor.execute("""
    DELETE FROM quests WHERE quest_id = ? AND pledger_id = ?
    """, (questID, pledgerID))

    conn.commit()
    conn.close()



def deleteAll(questID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    DELETE FROM pledges WHERE quest_id = ?
    """, (questID,))

    conn.commit()
    conn.close()



def getPledgesCount(userID):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""SELECT COUNT(*)
        FROM pledges
        WHERE pledger_id = ?""", (userID,))

    pledgesCount = cursor.fetchone()[0]
    conn.close()

    return pledgesCount