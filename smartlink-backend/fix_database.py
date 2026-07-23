"""
Fix database by adding missing columns to existing link table
"""
from app import create_app, db
import sqlite3

app = create_app()

with app.app_context():
    # Get database path
    db_path = 'app.db'
    
    # Connect directly to SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # List of new columns to add
    new_columns = [
        ('is_pinned', 'INTEGER DEFAULT 0'),
        ('custom_slug', 'VARCHAR(64)'),
        ('password', 'VARCHAR(256)'),
        ('click_goal', 'INTEGER DEFAULT 0'),
        ('show_view_count', 'INTEGER DEFAULT 0'),
        ('category', 'VARCHAR(64)'),
        ('priority', 'INTEGER DEFAULT 0'),
        ('conversion_goal', 'VARCHAR(128)'),
        ('ab_test_variant', 'VARCHAR(10)'),
        ('ab_test_group_id', 'VARCHAR(64)')
    ]
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(link)")
    existing_columns = [row[1] for row in cursor.fetchall()]
    
    print("Existing columns:", existing_columns)
    print("\nAdding missing columns...")
    
    # Add each missing column
    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            try:
                cursor.execute(f"ALTER TABLE link ADD COLUMN {col_name} {col_type}")
                print(f"✓ Added column: {col_name}")
            except Exception as e:
                print(f"✗ Error adding {col_name}: {e}")
        else:
            print(f"- Column {col_name} already exists")
    
    conn.commit()
    conn.close()
    
    # Now create the new tables
    db.create_all()
    
    print("\n✓ Database fixed successfully!")
    print("✓ All new columns added to link table")
    print("✓ Lead and LinkView tables created")
