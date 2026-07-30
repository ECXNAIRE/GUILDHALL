import sqlite3



def createNoticeTable():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
    receiver_id TEXT,
    title TEXT,
    body TEXT,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    received_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

    """)

    conn.commit()
    conn.close()


def insertNotices(receiver_id, title, body, type):
    createNoticeTable()
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO notifications (receiver_id, title, body, type)
    VALUES (?, ?, ?, ?)
    """, (receiver_id, title, body, type))

    conn.commit()
    conn.close()



def getNotice(receriverID):
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM notifications WHERE receiver_id = ?
    """, (receriverID,))

    notifications = cursor.fetchall()

    return notifications



createNoticeTable()