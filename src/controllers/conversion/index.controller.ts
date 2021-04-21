import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { BaseRepository } from "../../baseRepository";
import { SSEvents } from ".";

const Upload = require("../../database/models/upload");

export class ConversionController extends ResponseGenerator {
    constructor() {
        super();
    }

    static CALL_INTERVAL = 5000;

    static async uploadFile(req: Request, res: Response) {
        const { originalname } = req.file;

        try {
            const response = await BaseRepository.create(Upload, {
                fileUrl: "locationOfWhereFileIsStoredOnGCBucket",
                fileName: originalname,
            });

            const { fileId, fileName } = await response.get({
                plain: true,
            });

            return ResponseGenerator.sendSuccess(res, 200, {
                message: "File Upload Success",
                fileId,
                fileName,
            });
        } catch (error) {
            return ResponseGenerator.sendError(res, 400, error);
        }
    }

    static async setConvertTarget(req: Request, res: Response) {
        const { id, target } = req.params;

        const response = await BaseRepository.findAndUpdate(
            Upload,
            { target },
            { fileId: id },
        );

        const {
            fileName,
            target: targetFormat,
            fileId,
        } = response[1].dataValues;

        const targetName = fileName.split(".");
        targetName[targetName.length - 1] = targetFormat.toLowerCase();
        const theTargetName = targetName.join(".");

        return ResponseGenerator.sendSuccess(res, 200, {
            targetName: theTargetName,
            fileId,
        });
    }

    static async streamConversion(req: Request, res: Response) {
        const sse = new SSEvents(req, res);

        req.on("close", () => {
            sse.close();
        });

        let percentageConverted = 0;

        let timerId = setTimeout(function emitConversionState() {
            percentageConverted += 10;

            sse.send({ status: percentageConverted });

            if (percentageConverted === 100) {
                sse.close();
                clearTimeout(timerId);
            }

            timerId = setTimeout(
                emitConversionState,
                ConversionController.CALL_INTERVAL,
            );
        }, ConversionController.CALL_INTERVAL);
    }

    static async downloadFile(req: Request, res: Response) {
        const response = { fileName: "", convertTo: "" };

        const theFile = `${response.fileName}.${response.convertTo}`;
        const absPath = path.join(__dirname, "/targets_files/", theFile);
        const relPath = path.join(__dirname, "./targets_files", theFile);

        const dataText = new Uint8Array(
            Buffer.from("Thank you for using modelling to convert your files"),
        );

        try {
            fs.writeFile(relPath, dataText, (err) => {
                if (err) throw err;

                res.download(absPath, (err) => {
                    if (err) {
                        throw err;
                    }
                });

                fs.unlink(relPath, (err) => {
                    if (err) throw err;
                });
            });
        } catch (error) {
            this.sendError(res, 400, error);
        }
    }
}
