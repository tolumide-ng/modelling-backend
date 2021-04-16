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
        data: {},
        headers?: {},
    ): Response {
        const cleanResponse = this.removeNull({ data });

        if (headers) {
            return res.writeHead(statusCode, headers).send(cleanResponse);
        }

        return res.status(statusCode).send(cleanResponse);
    }
}
