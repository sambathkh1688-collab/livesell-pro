"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const knex_1 = __importDefault(require("knex"));
// SQLite configuration for development
const dbConfig = {
    client: 'sqlite3',
    connection: {
        filename: './livesell.db'
    },
    useNullAsDefault: true
};
const db = (0, knex_1.default)(dbConfig);
exports.default = db;
// Database utility functions
class Database {
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static async testConnection() {
        try {
            await db.raw('SELECT 1');
            return true;
        }
        catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }
    static async runMigrations() {
        try {
            await db.migrate.latest();
            console.log('✅ Database migrations completed successfully');
        }
        catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }
    static async seedDatabase() {
        try {
            await db.seed.run();
            console.log('✅ Database seeding completed successfully');
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        }
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map