import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AmazonS3Def, ConfigDef } from "./index.model";

import Aws from "aws-sdk";

export class AmazonS3 implements AmazonS3Def {
    private bucketUrl = `${process.env.AWS_BUCKET_URL}` || "";

    constructor() {}

    async upload(req: Request, res: Response, next: NextFunction) {
        const region = process.env.AWS_REGION;

        const params = {
            ACL: "public-read",
            Body: fs.createReadStream(req.file.path),
            Bucket: String(this.bucketUrl),
            ContentType: "application/octet-stream",
            Key: `${req.file.originalname}-${uuidv4()}`,
        };

        Aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new Aws.S3();

        console.log("_____________BEFORE THE REQUEST___________");
        const data = s3.upload(params).promise();
        // req.bucketUrl = data;
        console.log("*************OBTAINED DATA FROM S3***********", data);
        next();
    }
}
