import { Request, Response } from "express";
import { SSEvents } from "../../controllers/conversion";

export class ConversionMiddleware {
    static CALL_INTERVAL = 3000;

    static INCREASE_BY = 20;

    static convertFile(req: Request, res: Response) {
        const sse = new SSEvents(req, res);

        req.on("close", () => {
            console.log("shouldn't be here right>>>>>>>>>>>>_______");
            sse.close();
        });

        let percentageConverted = 0;

        let timerId = setTimeout(function emitConversionState() {
            percentageConverted += ConversionMiddleware.INCREASE_BY;

            console.log(
                "W-------------W-------------W-------------W-------------",
                percentageConverted,
            );

            sse.send({ status: percentageConverted });

            console.log("WELINGTON((((())))))WELINGTON");

            if (percentageConverted === 100) {
                console.log("HERE UYET????????");
                sse.close();
                clearTimeout(timerId);
            }

            timerId = setTimeout(
                emitConversionState,
                ConversionMiddleware.CALL_INTERVAL,
            );
        }, 0);
    }
}
