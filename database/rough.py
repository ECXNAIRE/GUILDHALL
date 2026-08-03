import sqlite3

def showQuests():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("DROP TABLE users")

    conn.commit()
    conn.close()


showQuests()