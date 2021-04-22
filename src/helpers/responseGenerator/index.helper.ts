import { Utils } from "../utils";
import { Response, RequestHandler } from "express";

export class ResponseGenerator extends Utils {
    static sendError(res: Response, statusCode: number, message: string) {
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

    static composeHanlders(...middleware: RequestHandler[]): RequestHandler {
        return middleware.reduce(
            (currentMiddleware, nextMiddleware) => (req, res, next) =>
                currentMiddleware(req, res, (err: any) => {
                    if (err) {
                        return next(err);
                    }

                    nextMiddleware(req, res, next);
                }),
        );
    }
}
