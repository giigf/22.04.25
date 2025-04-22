const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('notes').del();
  await knex('users').del();

  const hashed = await bcrypt.hash('123456', 10);

  const [userId] = await knex('users').insert({
    email: 'test@example.com',
    password: hashed
  }).returning('id');

  await knex('notes').insert([
    {
      title: 'Первая заметка',
      content: 'Я только что научился делать сиды!',
      user_id: userId.id || userId // зависит от версии PostgreSQL
    },
    {
      title: 'Ещё одна мысль',
      content: 'JWT — это круто, но кофе тоже важно.',
      user_id: userId.id || userId
    }
  ]);
};
