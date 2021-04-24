import "mocha";
import sinon from "sinon";
import { Response, Request } from "express";
import { SSEvents } from "../../controllers/conversion";
import { ConversionMiddleware } from ".";

describe("Conversion Middleware", () => {
    const req: Request = {} as Request;
    const res: Response = {} as Response;

    beforeEach(() => {
        res.writeHead = sinon.stub().returns(res);
        res.write = sinon.stub().returns(true);
        res.end = sinon.stub().returns(res);
        res.emit = sinon.stub().returns(res);
        req.on = sinon.stub().returns(req);
    });

    it.only("Should stream file conversion progress", async () => {
        const spySSESend = sinon.spy(SSEvents.prototype, "send");

        ConversionMiddleware.CALL_INTERVAL = 200;
        ConversionMiddleware.INCREASE_BY = 50;

        ConversionMiddleware.convertFile(req, res);

        spySSESend.calledWith({ status: 50 });
    });
});
