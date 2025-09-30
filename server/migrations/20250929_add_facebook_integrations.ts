import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create facebook_integrations table to store user OAuth tokens
  await knex.schema.createTable('facebook_integrations', (table) => {
    table.string('id').primary()
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
    table.string('organization_id').notNullable() // Will be added when organizations table is created
    table.text('access_token').notNullable()
    table.string('token_type').defaultTo('bearer')
    table.timestamp('token_expires_at')
    table.boolean('is_active').defaultTo(true)
    table.timestamp('connected_at').defaultTo(knex.fn.now())
    table.timestamp('last_used_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Ensure one active integration per user/org
    table.unique(['user_id', 'organization_id'])
  })

  // Add organization_id and other missing fields to facebook_pages
  await knex.schema.alterTable('facebook_pages', (table) => {
    table.string('organization_id').notNullable().defaultTo('default-org')
    table.string('page_url')
    table.string('profile_picture_url')
    table.string('category')
  })
  
  // Drop and recreate the unique constraint to include organization_id
  await knex.schema.raw('DROP INDEX facebook_pages_facebook_page_id_unique')
  await knex.schema.raw('CREATE UNIQUE INDEX facebook_pages_org_page_unique ON facebook_pages (organization_id, facebook_page_id)')
}

export async function down(knex: Knex): Promise<void> {
  // Remove added columns from facebook_pages
  await knex.schema.alterTable('facebook_pages', (table) => {
    table.dropUnique(['organization_id', 'facebook_page_id'])
    table.dropColumn('organization_id')
    table.dropColumn('page_url')
    table.dropColumn('profile_picture_url')
    table.dropColumn('category')
    table.unique(['facebook_page_id'])
  })

  // Drop facebook_integrations table
  await knex.schema.dropTableIfExists('facebook_integrations')
}