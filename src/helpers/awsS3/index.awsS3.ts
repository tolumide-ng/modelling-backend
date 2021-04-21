import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AmazonS3Def, ConfigDef } from "./index.model";

import Aws from "aws-sdk";

export class AmazonS3 implements AmazonS3Def {
    req: Request;
    res: Response;
    next: NextFunction;
    config: ConfigDef;

    constructor(
        req: Request,
        res: Response,
        next: NextFunction,
        config: ConfigDef,
    ) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.config = config;
    }

    async upload(req: Request, res: Response, next: NextFunction) {
        const region = process.env.AWS_REGION;

        const params = {
            ACL: "public-read",
            Body: fs.createReadStream(req.file.path),
            Bucket: String(this.config.bucketUrl),
            ContentType: "application/octet-stream",
            Key: `${req.file.originalname}-${uuidv4()}`,
        };

        Aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new Aws.S3();

        try {
            const data = s3.upload(params).promise();
            // req.bucketUrl = data;
            console.log("OBTAINED DATA FROM S3", data);
            next();
        } catch (error) {}
    }
}
