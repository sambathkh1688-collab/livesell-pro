import { Knex } from 'knex';
interface DatabaseConfig {
    [key: string]: Knex.Config;
}
declare const config: DatabaseConfig;
export default config;
//# sourceMappingURL=database.d.ts.map