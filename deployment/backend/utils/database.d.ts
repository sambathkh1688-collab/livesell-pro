import knex from 'knex';
declare const db: knex.Knex<any, unknown[]>;
export default db;
export declare class Database {
    static generateUUID(): string;
    static testConnection(): Promise<boolean>;
    static runMigrations(): Promise<void>;
    static seedDatabase(): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map