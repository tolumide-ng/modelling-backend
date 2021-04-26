"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Uploads", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fileUrl: {
                type: Sequelize.TEXT,
            },
            fileId: {
                type: Sequelize.UUID,
            },
            fileName: {
                type: Sequelize.TEXT,
            },
            target: {
                type: Sequelize.STRING,
            },
            targetUrl: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Uploads");
    },
};
