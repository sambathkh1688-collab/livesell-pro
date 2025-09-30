const Database = require('better-sqlite3')
const path = require('path')

// Connect to database  
const dbPath = path.join(__dirname, 'server', 'livesell.db')
const db = new Database(dbPath)

console.log('🔄 Adding facebook_user_name and facebook_user_id columns...')

try {
  // Add columns if they don't exist
  try {
    db.exec(`ALTER TABLE facebook_integrations ADD COLUMN facebook_user_name VARCHAR(255)`)
    console.log('✅ Added facebook_user_name column')
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('✅ facebook_user_name column already exists')
    } else {
      throw e
    }
  }

  try {
    db.exec(`ALTER TABLE facebook_integrations ADD COLUMN facebook_user_id VARCHAR(255)`)
    console.log('✅ Added facebook_user_id column')
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('✅ facebook_user_id column already exists')
    } else {
      throw e
    }
  }

  console.log('\n🔍 Updated table structure:')
  const schema = db.prepare("PRAGMA table_info(facebook_integrations)").all()
  schema.forEach(col => console.log(`   ${col.name} (${col.type})`))

  console.log('\n✅ Database migration complete!')
} catch (error) {
  console.error('❌ Migration error:', error.message)
} finally {
  db.close()
}