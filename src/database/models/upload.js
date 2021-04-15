"use strict";

import Model from "sequelize";

module.exports = (sequelize, DataTypes) => {
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
            imageUrl: DataTypes.STRING,
            imageId: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: "Upload",
        },
    );
    return Upload;
};
