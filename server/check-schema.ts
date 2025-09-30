import sqlite3 from 'sqlite3'

const DB_PATH = './livesell.db'

console.log('🔍 Checking Database Schema...')

const db = new sqlite3.Database(DB_PATH)

// Get schema for facebook_integrations
db.all(`PRAGMA table_info(facebook_integrations)`, (err, columns: any[]) => {
  if (err) {
    console.error('❌ Error:', err)
  } else {
    console.log('\n📋 facebook_integrations table schema:')
    columns.forEach(col => {
      console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`)
    })
  }
  
  // Get schema for facebook_pages
  db.all(`PRAGMA table_info(facebook_pages)`, (err, pageColumns: any[]) => {
    if (err) {
      console.error('❌ Error:', err)
    } else {
      console.log('\n📄 facebook_pages table schema:')
      pageColumns.forEach(col => {
        console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`)
      })
    }
    
    db.close()
  })
})