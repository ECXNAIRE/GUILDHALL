import sqlite3

def checkUserID(provider_id):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT  user_id FROM users WHERE provider_id = ?
    """, (provider_id,))

    user = cursor.fetchone()
    conn.close()
    return user
