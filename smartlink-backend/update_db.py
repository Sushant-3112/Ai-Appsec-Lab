import sqlite3
import os

db_path = 'app.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(analytics)")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Check link table
    cursor.execute("PRAGMA table_info(link)")
    link_columns = [col[1] for col in cursor.fetchall()]
    
    try:
        if 'animation' not in link_columns:
            cursor.execute("ALTER TABLE link ADD COLUMN animation VARCHAR(20)")
        if 'thumbnail' not in link_columns:
            cursor.execute("ALTER TABLE link ADD COLUMN thumbnail VARCHAR(256)")
            
        if 'browser' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN browser VARCHAR(64)")
        if 'os' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN os VARCHAR(64)")
        if 'referral_source' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN referral_source VARCHAR(256)")
        if 'session_duration' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN session_duration FLOAT DEFAULT 0.0")
        if 'is_bot' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN is_bot BOOLEAN DEFAULT 0")
        if 'engagement_score' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN engagement_score FLOAT DEFAULT 0.0")
        if 'unique_visitor_id' not in columns:
            cursor.execute("ALTER TABLE analytics ADD COLUMN unique_visitor_id VARCHAR(128)")
        
        conn.commit()
        print("Database schema updated successfully.")
    except Exception as e:
        print(f"Error updating schema: {e}")
    finally:
        conn.close()
else:
    print("Database not found.")
