import sqlite3

def showQuests():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pledges ")
    quests = cursor.fetchall()

    print(quests)

    conn.close()


showQuests()