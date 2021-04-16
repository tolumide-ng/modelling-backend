import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { Upload } from "../../database/models/upload";
import { BaseRepository } from "../../baseRepository";

export class ConversionController extends ResponseGenerator {
    static CALL_INTERVAL = 5000;

    static async uploadFile(req: Request, res: Response) {
        const { bucketUrl, fileName } = req;

        const response = await BaseRepository.create(Upload, {
            fileUrl: bucketUrl,
            fileName: fileName,
        });

        console.log("THE RESPOSNE FROM THE COMMAND REQUEST", response);

        this.sendSuccess(res, 201, {
            fileUrl: "",
            fileName: "",
        });
    }

    static async convertFile(req: Request, res: Response) {
        const headers = {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
        };

        const { id: fileId, target } = req.params;

        await BaseRepository.findAndUpdate(
            Upload,
            { converTo: target },
            { fileId },
        );

        let percentageConverted = 0;

        res.writeHead(200, headers);

        let timerId = setTimeout(function emitConversionState() {
            percentageConverted += 10;
            ResponseGenerator.sendSuccess(res, 200, {
                percentage: percentageConverted,
            });

            if (percentageConverted === 100) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(
                emitConversionState,
                ConversionController.CALL_INTERVAL,
            );
        }, this.CALL_INTERVAL);
    }

    static async downloadFile(req: Request, res: Response) {
        const response = await BaseRepository.findOneByField(Upload, {
            fileId: req.params.id,
        });

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
