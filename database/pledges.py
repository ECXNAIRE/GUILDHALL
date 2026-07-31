import sqlite3


def pledgeTable():
    conn = sqlite3.connect("database/database.db")
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

    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO pledges (quest_id, master_id, pledger_id, status)
    VALUES (?, ?, ?, ?)
    """, (questID, masterID, pledgerID, "PENDING"))

    conn.commit()
    conn.close()


def getPledgesByQuestId(questID):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM pledges WHERE quest_id = ?
    """, (questID,))

    pledges = cursor.fetchall()

    return pledges


