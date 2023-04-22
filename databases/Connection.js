const dotenv = require("dotenv").config();
const knex = require("knex");

const connection = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_CONNECTION_HOST,
        user: process.env.PG_CONNECTION_USER,
        password: process.env.PG_CONNECTION_PASSWORD,
        database: process.env.PG_CONNECTION_DATABASE
    }
});

module.exports = connection;
