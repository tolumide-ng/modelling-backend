import { Model } from "sequelize";
import { db } from "../database/models";
const { sequelize } = db;

export class BaseRepository {
    static async create(model: any, options: object) {
        return model.create(options);
    }

    static async findOneByField(model: any, options: object) {
        return model.findOne({ where: options });
    }

    static async findAndUpdate(model: any, fields: {}, options: {}) {
        return model.update(fields, {
            where: options,
            returning: true,
            plain: true,
        });
    }
}
