export class BaseRepository {
    static async create(model: any, options: object) {
        return model.create(options);
    }

    static async findOneByField(model: any, options: object) {
        return model.findOne({ where: options });
    }

    static async findAll(model: any, options: object) {
        return model.findAll({ ...options });
    }

    static async findAndUpdate(model: any, fields: {}, options: {}) {
        return model.update(fields, {
            where: options,
            returning: true,
            plain: true,
        });
    }
}
