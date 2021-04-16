"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "../models";

export class Upload extends Model {
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
        fileName: DataTypes.STRING,
        fileUrl: DataTypes.STRING,
        fileId: DataTypes.UUID,
        convertTo: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: "Upload",
    },
);
// return Upload;
