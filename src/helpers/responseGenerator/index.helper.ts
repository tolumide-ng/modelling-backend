import { Response, RequestHandler } from "express";
import { Utils } from "../utils";
import { StatusCodeDef } from ".";

export class ResponseGenerator extends Utils {
    static codeResponseDic: StatusCodeDef = {
        404: "Resource Not Found",
        500: "Internal Server Error",
        200: "Success",
        415: "Unsupported Media Type: Only multipart/form-data .shapr files are supported",
        400: "Bad Request",
    };

    static sendError(res: Response, statusCode: number, message: string = "") {
        const responseMessage: string = message
            ? message
            : this.codeResponseDic[statusCode];

        return res.status(statusCode).send({ message: responseMessage });
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
