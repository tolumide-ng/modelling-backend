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
                type: Sequelize.STRING,
                allowNull: false,
            },
            fileName: {
                type: Sequelize.STRING,
            },
            fileId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            convertTo: {
                type: Sequelize.STRING,
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
