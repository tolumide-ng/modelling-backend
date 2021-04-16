const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    development: {
        use_env_variable: "DATABASE_DEV_URL",
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
        use_env_variable: "DATABASE_TEST_URL",
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
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        logging: false,
        port: 5432,
        ssl: true,
        operatorsAliases: false,
        dialectOption: {
            ssl: true,
            native: true,
        },
    },
};
