const Database = require('better-sqlite3')
const path = require('path')

// Connect to database  
const dbPath = path.join(__dirname, 'server', 'livesell.db')
const db = new Database(dbPath)

console.log('🔍 Checking table structure:')
try {
  // Check facebook_integrations table structure
  const integrationsSchema = db.prepare("PRAGMA table_info(facebook_integrations)").all()
  console.log('\nfacebook_integrations columns:')
  integrationsSchema.forEach(col => console.log(`   ${col.name} (${col.type})`))

  // Check facebook_pages table structure  
  const pagesSchema = db.prepare("PRAGMA table_info(facebook_pages)").all()
  console.log('\nfacebook_pages columns:')
  pagesSchema.forEach(col => console.log(`   ${col.name} (${col.type})`))

  console.log('\n🔍 Checking Facebook Integrations:')
  const integrations = db.prepare(`
    SELECT * FROM facebook_integrations 
    ORDER BY updated_at DESC 
    LIMIT 3
  `).all()

  if (integrations.length === 0) {
    console.log('   No integrations found')
  } else {
    integrations.forEach((row, index) => {
      console.log(`\n${index + 1}. Facebook Integration:`)
      console.log(`   User ID: ${row.user_id}`)
      console.log(`   Org ID: ${row.organization_id}`) 
      console.log(`   Facebook User: ${row.facebook_user_name} (${row.facebook_user_id})`)
      console.log(`   Active: ${row.is_active ? 'Yes' : 'No'}`)
      console.log(`   Created: ${row.created_at}`)
      console.log(`   Updated: ${row.updated_at}`)
    })
  }

  console.log('\n🔍 Checking Facebook Pages:')
  const pages = db.prepare(`
    SELECT organization_id, facebook_page_id, page_name, category, is_active, created_at, updated_at 
    FROM facebook_pages 
    ORDER BY updated_at DESC 
    LIMIT 3
  `).all()

  if (pages.length === 0) {
    console.log('   No pages found')
  } else {
    pages.forEach((row, index) => {
      console.log(`\n${index + 1}. Facebook Page:`)
      console.log(`   Org ID: ${row.organization_id}`)
      console.log(`   Page ID: ${row.facebook_page_id}`)
      console.log(`   Name: ${row.page_name}`)
      console.log(`   Category: ${row.category}`)
      console.log(`   Active: ${row.is_active ? 'Yes' : 'No'}`)
      console.log(`   Created: ${row.created_at}`)
      console.log(`   Updated: ${row.updated_at}`)
    })
  }

  console.log('\n✅ Database check complete!')
} catch (error) {
  console.error('❌ Database error:', error.message)
} finally {
  db.close()
}