import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AmazonS3Def, ConfigDef } from "./index.model";

import Aws from "aws-sdk";

export class AmazonS3 implements AmazonS3Def {
    private bucketUrl = `${process.env.AMAZON_S3_BUCKET}` || "";

    constructor() {}

    async upload(req: Request, res: Response, next: NextFunction) {
        const region = process.env.AWS_REGION;

        console.log(
            "WHAT THE REQUEST ITSELF IS?>??????>>>>>>>",
            req.file.buffer,
        );

        // const buffer = new Buffer(req.file.buffer, "binary");

        const params = {
            ACL: "public-read",
            // Buffer|Uint8Array|Blob|string|Readable
            Body: req.file.buffer,
            Bucket: String(this.bucketUrl),
            ContentType: req.file.mimetype,
            Key: `${req.file.originalname}-${uuidv4()}`,
        };

        Aws.config.update({
            accessKeyId: process.env.AMAZON_S3_ACCESS_KEY,
            secretAccessKey: process.env.AMAZON_S3_SECRET_KEY,
        });

        const s3 = new Aws.S3();

        console.log("_____________BEFORE THE REQUEST___________");
        const data = s3.upload(params).promise();
        // req.bucketUrl = data;
        console.log("*************OBTAINED DATA FROM S3***********", data);
        next();
    }
}
