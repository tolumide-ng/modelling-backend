import { Request, Response, NextFunction } from "express";
import { S3 } from "aws-sdk";

export interface FileUploadDef {
    uploadOriginal(req: Request, res: Response, next: NextFunction): void;

    uploadConverted(
        file: Buffer,
        desiredName: string,
    ): Promise<string | undefined>;

    generateParams(fileKey: String, body: FileTypes, mimeType: string): void;
}

export interface ConfigDef {
    [key: string]: number | string;
}

export type FileTypes = Buffer | Uint8Array | Blob | string;

export interface FileParamsDef extends S3.Types.PutObjectRequest {}
