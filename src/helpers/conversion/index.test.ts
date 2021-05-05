import "mocha";
import sinon from "sinon";
import { Response, Request } from "express";
import { SSEvents } from "../../events/conversion";
import { ConversionHelper } from "../conversion";

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

    it("Should stream file conversion progress", async () => {
        const spySSESend = sinon.spy(SSEvents.prototype, "send");

        ConversionHelper.CALL_INTERVAL = 200;
        ConversionHelper.INCREASE_BY = 50;

        ConversionHelper.convertFile(req, res);

        spySSESend.calledWith({ status: 50 });
        spySSESend.restore();
    });
});
