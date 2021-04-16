import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { Upload } from "../../database/models/upload";
import { BaseRepository } from "../../baseRepository";

export class ConversionController extends ResponseGenerator {
    static CALL_INTERVAL = 5000;

    static async uploadFile(req: Request, res: Response) {
        const { bucketUrl } = req;

        const response = await BaseRepository.create(Upload, {
            imageUrl: bucketUrl,
        });

        console.log("THE RESPOSNE FROM THE COMMAND REQUEST", response);

        this.sendSuccess(res, 201, {
            imageUrl: "",
        });
    }

    static async convertFile(req: Request, res: Response) {
        const headers = {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
        };

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
}
