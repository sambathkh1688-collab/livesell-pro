import sqlite3 from 'sqlite3'

const DB_PATH = './livesell.db'

console.log('🔍 Checking Database Contents...')

function checkDatabase() {
  const db = new sqlite3.Database(DB_PATH)
  
  // Check if tables exist
  db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
    if (err) {
      console.error('❌ Database error:', err)
      return
    }
    
    console.log('📋 Available tables:', tables.map((t: any) => t.name))
    
    // Check facebook_integrations table
    db.all(`SELECT * FROM facebook_integrations`, (err, rows) => {
      if (err) {
        console.error('❌ Error reading facebook_integrations:', err)
      } else {
        console.log('\n🔗 Facebook Integrations:')
        console.log('Number of records:', rows.length)
        
        rows.forEach((row: any, index) => {
          console.log(`\nRecord ${index + 1}:`)
          console.log('  ID:', row.id)
          console.log('  User ID:', row.user_id)
          console.log('  Facebook User ID:', row.facebook_user_id)
          console.log('  Access Token:', row.access_token ? 'SET (' + row.access_token.length + ' chars)' : 'NOT SET')
          console.log('  Created:', row.created_at)
        })
      }
      
      // Check facebook_pages table
      db.all(`SELECT * FROM facebook_pages`, (err, pageRows) => {
        if (err) {
          console.error('❌ Error reading facebook_pages:', err)
        } else {
          console.log('\n📄 Facebook Pages:')
          console.log('Number of records:', pageRows.length)
          
          pageRows.forEach((row: any, index) => {
            console.log(`\nPage ${index + 1}:`)
            console.log('  ID:', row.id)
            console.log('  Page ID:', row.page_id)
            console.log('  Name:', row.name)
            console.log('  Access Token:', row.access_token ? 'SET (' + row.access_token.length + ' chars)' : 'NOT SET')
            console.log('  Is Active:', row.is_active)
          })
        }
        
        db.close()
      })
    })
  })
}

checkDatabase()