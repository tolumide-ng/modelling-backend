import { Model, DataTypes } from "sequelize";
import { db } from "./index";

const { sequelize } = db;

// module.exports = (sequelize, DataTypes) => {
class Upload extends Model {
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
        fileUrl: DataTypes.STRING,
        fileId: DataTypes.UUID,
        fileName: DataTypes.STRING,
        convertTp: DataTypes.STRING,
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
// };
