import { Request, Response } from "express";

export class SSEvents<T> {
    headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };

    req: Request;
    res: Response;

    alive: boolean;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;

        this.alive = true;

        // set the header on init
        this.res.writeHead(200, this.headers);
    }

    send(message: T) {
        if (this.alive) {
            this.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
    }

    close() {
        this.res.end();
        this.alive = false;
    }

    error() {
        this.res.emit("close");
        this.close();
    }
}
