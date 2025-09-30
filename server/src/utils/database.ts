import knex from 'knex'

// SQLite configuration for development
const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: './livesell.db'
  },
  useNullAsDefault: true
}

const db = knex(dbConfig)

export default db

// Database utility functions
export class Database {
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  static async testConnection(): Promise<boolean> {
    try {
      await db.raw('SELECT 1')
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }

  static async runMigrations(): Promise<void> {
    try {
      await db.migrate.latest()
      console.log('✅ Database migrations completed successfully')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  }

  static async seedDatabase(): Promise<void> {
    try {
      await db.seed.run()
      console.log('✅ Database seeding completed successfully')
    } catch (error) {
      console.error('❌ Seeding failed:', error)
      throw error
    }
  }
}