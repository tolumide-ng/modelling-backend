import { Request, Response, NextFunction } from "express";

export interface AmazonS3Def {
    upload(req: Request, res: Response, next: NextFunction): void;
}

export interface ConfigDef {
    [key: string]: number | string;
}
