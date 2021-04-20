import { Request, Response } from "express";

export class SSEvents<T> {
    headers = {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;

        // set the header on init
        this.res.writeHead(200, this.headers);
    }

    send(message: T) {
        this.res.write(JSON.stringify(message));
    }
}
