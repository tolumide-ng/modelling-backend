import { RequestHandler } from "express";
import { ResponseGenerator } from "../../../helpers/responseGenerator";

export const validateReceivedFile: RequestHandler = (req, res, next) => {
    if (!req.file) {
        ResponseGenerator.sendError(
            res,
            405,
            "Please provide a supported file type",
        );
    }

    if (!req.is("multipart")) {
        return ResponseGenerator.sendError(
            res,
            415,
            "Unsupported Media Type: Please use multipart/form-data",
        );
    }

    if (!["application/octet-stream"].includes(req.file.mimetype)) {
        return ResponseGenerator.sendError(
            res,
            415,
            "Unsupported Media Type: Only .shapr files are supported",
        );
    }

    next();
};
