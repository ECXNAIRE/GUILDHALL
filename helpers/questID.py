import sqlite3
import random
import string


def checkQuestID(questID):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()


    cursor.execute("""
    SELECT 1 FROM quests WHERE quest_id = ? 
    """, (questID,))
    exists = cursor.fetchone() is not None
    conn.close()
    return exists




def generateQuestId():
    while True:
        newID = "QST_" + "".join(
            random.choices(string.ascii_uppercase + string.digits, k=10)
        )

        if not checkQuestID(newID):
            return newID