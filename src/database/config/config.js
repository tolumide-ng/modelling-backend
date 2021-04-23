const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        ssl: true,
        logging: true,
        define: {
            timestamps: false,
        },
        dialectOption: {
            ssl: true,
            native: true,
        },
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        ssl: true,
        define: {
            timestamps: false,
        },
        dialectOption: {
            ssl: true,
            native: true,
        },
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        ssl: true,
        operatorsAliases: false,
        dialectOption: {
            native: true,
            ssl: true,
        },
    },
};
