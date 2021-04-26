import { Model, DataTypes } from "sequelize";
import { db } from "./index";

const { sequelize } = db;

// module.exports = (sequelize, DataTypes) => {
export default class Upload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
Upload.init(
    {
        fileUrl: DataTypes.TEXT,
        fileId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        fileName: DataTypes.TEXT,
        target: DataTypes.STRING,
        targetUrl: DataTypes.TEXT,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
    },
    {
        sequelize,
        modelName: "Upload",
    },
);

module.exports = Upload;
