import sinon from "sinon";
import { Response } from "express";

export const mockResponse = () => {
    const res: Partial<Response> = {};
    res.json = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);

    return res;
};
