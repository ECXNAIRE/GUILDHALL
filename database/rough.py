import sqlite3

conn = sqlite3.connect("database/database.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM users WHERE email = ?", ("prashantc48774.r@gmail.com",))

user = cursor.fetchone()


print(user[5])

conn.close()