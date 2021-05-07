import { RequestHandler } from "express";
import { BaseRepository } from "../../baseRepository";
import { ResponseGenerator } from "../../helpers/responseGenerator";

import Upload from "../../database/models/upload";

export const validTargets = ["STEP", "STL", "IGES"];

export const validateReceivedFile: RequestHandler = (req, res, next) => {
    if (!req.file) {
        return ResponseGenerator.sendError(
            res,
            400,
            "Please provide a supported file type",
        );
    }

    if (!req.is("multipart")) {
        return ResponseGenerator.sendError(res, 415);
    }

    if (!["application/octet-stream"].includes(req.file.mimetype)) {
        return ResponseGenerator.sendError(res, 415);
    }

    next();
};

export const isIdPresent: RequestHandler = (req, res, next) => {
    if (!req.params.id) {
        return ResponseGenerator.sendError(
            res,
            400,
            "Please provide a valid file id",
        );
    }

    next();
};

export const isIdValid: RequestHandler = async (req, res, next) => {
    try {
        const response = await BaseRepository.findOneByField(Upload, {
            fileId: req.params.id,
        });

        if (response === null) {
            return ResponseGenerator.sendError(res, 404, "Resource not found");
        }

        next();
    } catch (error) {
        return ResponseGenerator.sendError(res, 404, "Resource not found");
    }
};

export const isValidTarget: RequestHandler = (req, res, next) => {
    if (!validTargets.includes(req.params.target.toUpperCase())) {
        return ResponseGenerator.sendError(res, 415);
    }

    next();
};
