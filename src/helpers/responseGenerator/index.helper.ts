import { Utils } from "../utils";
import { Response } from "express";

export class ResponseGenerator extends Utils {
    static sendError(
        res: Response,
        statusCode: number,
        message: string,
    ): Response {
        return res.status(statusCode).send({ message });
    }

    static sendSuccess(
        res: Response,
        statusCode: number,
        message: string,
        data: {},
    ): Response {
        const cleanResponse = this.removeNull({ message, data });

        return res.status(statusCode).send(cleanResponse);
    }
}
