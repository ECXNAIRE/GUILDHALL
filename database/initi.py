import sqlite3

conn = sqlite3.connect("database/database.db")
cursor = conn.cursor()


cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
provider TEXT NOT NULL,
provider_id TEXT UNIQUE NOT NULL,
username TEXT,
email TEXT,
avatar TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")


conn.commit()
conn.close()
print("db created")