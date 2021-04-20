import { RequestHandler } from "express";
import { BaseRepository } from "../../../baseRepository";
import { ResponseGenerator } from "../../../helpers/responseGenerator";
import { targetTypeDef } from "./index";

const Upload = require("../../database/models/upload");

export const validTargets = ["STEP", "STL", "IGES"];

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

export const isIdPresent: RequestHandler = (req, res, next) => {
    if (!req.params.id) {
        return ResponseGenerator.sendError(
            res,
            400,
            "Please provide a valid file id",
        );
    }
};

export const isIdValid: RequestHandler = async (req, res, next) => {
    const response = await BaseRepository.findOneByField(Upload, {
        fileId: req.params.id,
    });

    if (!response) {
        return ResponseGenerator.sendError(res, 404, "Resource not found");
    }

    next();
};

export const isValidTarget: RequestHandler = async (req, res, next) => {
    if (!validTargets.includes(req.params.target)) {
        return ResponseGenerator.sendError(res, 415, "Unsupported Media Type");
    }

    next();
};
