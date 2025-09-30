import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('email').unique().notNullable()
    table.string('password_hash').notNullable()
    table.string('name').notNullable()
    table.string('avatar_url')
    table.boolean('email_verified').defaultTo(false)
    table.string('subscription_tier').defaultTo('free')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Facebook pages table
  await knex.schema.createTable('facebook_pages', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('facebook_page_id').unique().notNullable()
    table.string('page_name').notNullable()
    table.string('access_token').notNullable()
    table.json('page_data')
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Live streams table
  await knex.schema.createTable('live_streams', (table) => {
    table.uuid('id').primary()
    table.uuid('facebook_page_id').references('id').inTable('facebook_pages').onDelete('CASCADE')
    table.string('stream_id').unique().notNullable()
    table.string('title')
    table.string('description')
    table.enum('status', ['live', 'ended', 'scheduled']).defaultTo('live')
    table.integer('viewer_count').defaultTo(0)
    table.timestamp('started_at')
    table.timestamp('ended_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Comments table
  await knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary()
    table.uuid('live_stream_id').references('id').inTable('live_streams').onDelete('CASCADE')
    table.string('facebook_comment_id').unique().notNullable()
    table.string('user_name').notNullable()
    table.string('user_id').notNullable()
    table.text('message').notNullable()
    table.json('metadata')
    table.timestamp('posted_at').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comments')
  await knex.schema.dropTableIfExists('live_streams')
  await knex.schema.dropTableIfExists('facebook_pages')
  await knex.schema.dropTableIfExists('users')
}