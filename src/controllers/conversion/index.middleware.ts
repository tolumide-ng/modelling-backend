import { Request, Response } from "express";
import { SSEvents } from ".";

export class FileConverter {
    static CALL_INTERVAL = 3000;

    static async convertFile(req: Request, res: Response) {
        const sse = new SSEvents(req, res);
        let percentageConverted = 0;

        let timerId = setTimeout(function emitConversionState() {
            percentageConverted += 20;

            sse.send({ status: percentageConverted });

            if (percentageConverted === 100) {
                sse.close();
                clearTimeout(timerId);
            }

            timerId = setTimeout(
                emitConversionState,
                FileConverter.CALL_INTERVAL,
            );
        }, 0);
    }
}
