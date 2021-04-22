import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { FileUploadDef, FileTypes, FileParamsDef } from "./index.model";

import Aws from "aws-sdk";
import { ResponseGenerator } from "../responseGenerator";

export class AmazonS3 implements FileUploadDef {
    static bucketUrl = String(`${process.env.AMAZON_S3_BUCKET}`) || "";
    static ACL = "public-read";
    static mimeType = "application/octet-stream";

    bucketService: Aws.S3;

    constructor() {
        Aws.config.update({
            accessKeyId: process.env.AMAZON_S3_ACCESS_KEY,
            secretAccessKey: process.env.AMAZON_S3_SECRET_KEY,
        });

        this.bucketService = new Aws.S3();
    }

    generateParams(fileKey: string, fileBody: FileTypes): FileParamsDef {
        return {
            ACL: AmazonS3.ACL,
            Body: fileBody,
            Bucket: AmazonS3.bucketUrl,
            ContentType: AmazonS3.mimeType,
            Key: fileKey,
        };
    }

    async uploadOriginal(req: Request, res: Response, next: NextFunction) {
        try {
            const params = this.generateParams(
                `${uuidv4()}-${req.file.originalname}`,
                req.file.buffer,
            );
            await this.bucketService
                .upload(params)
                .promise()
                .then((data) => {
                    req.bucketUrl = data.Location;
                    next();
                });
        } catch (error) {
            return ResponseGenerator.sendError(
                res,
                400,
                "Please try again later",
            );
        }
    }

    uploadConverted(
        file: FileTypes,
        desiredName: string,
    ): Promise<string | undefined> {
        let bucketUrl: string | undefined = undefined;

        return new Promise((res, rej) => {
            const params = this.generateParams(desiredName, file);
            this.bucketService
                .upload(params)
                .promise()
                .then((data) => {
                    bucketUrl = data.Location;
                    return res(bucketUrl);
                })
                .catch(() => {
                    rej(bucketUrl);
                });
        });
    }
}
