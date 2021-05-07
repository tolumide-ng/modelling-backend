import { Request, Response } from "express";
import { SSEvents } from "../../events/conversion";

export class ConversionHelper {
    static CALL_INTERVAL = 3000;

    static INCREASE_BY = 20;

    static convertFile(req: Request, res: Response) {
        const sse = new SSEvents(req, res);

        req.on("close", () => {
            return sse.close();
        });

        let percentageConverted = 0;

        let timerId = setTimeout(function emitConversionState() {
            percentageConverted += ConversionHelper.INCREASE_BY;

            sse.send({ status: percentageConverted });

            if (percentageConverted === 100) {
                sse.close();
                clearTimeout(timerId);
            }

            timerId = setTimeout(
                emitConversionState,
                ConversionHelper.CALL_INTERVAL,
            );
        }, 0);
    }
}
