import "mocha";
import sinon, { assert, createSandbox } from "sinon";
import { Response, Request } from "express";
import { SSEvents } from ".";
import { expect } from "chai";

describe("Conversion Event", () => {
    const req: Request = {} as Request;
    const res: Response = {} as Response;
    const MESSAGE = "MESSAGE";

    res.writeHead = sinon.stub().callsFake((statusCode, header) => {});
    res.write = sinon.stub().returns(true);
    res.end = sinon.stub().returns(res);
    res.emit = sinon.stub().returns(res);
    req.on = sinon.stub().returns(req);
    const sse = new SSEvents(req, res);

    it("Should have an headers property", async () => {
        expect(sse.headers).to.have.property("Connection");
        expect(sse.headers).to.have.property("Cache-Control");
        expect(sse.headers).to.have.property("Content-Type");
    });

    it("Should invoke the class methods", async () => {
        const sendSpy = sinon.spy(SSEvents.prototype, "send");
        const closeSpy = sinon.spy(SSEvents.prototype, "close");
        const errorSpy = sinon.spy(SSEvents.prototype, "error");

        sse.send(MESSAGE);
        sse.close();
        sse.error();

        sendSpy.calledWith(MESSAGE);
        closeSpy.called;
        errorSpy.called;

        sendSpy.restore();
        closeSpy.restore();
        errorSpy.restore();
    });
});
