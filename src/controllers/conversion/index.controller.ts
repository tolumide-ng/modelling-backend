import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { Upload } from "../../database/models/upload";
import { BaseRepository } from "../../baseRepository";

export class ConversionController extends ResponseGenerator {
    static async uploadFile(req: Request, res: Response) {
        const { bucketUrl } = req;

        const response = await BaseRepository.create(Upload, {
            imageUrl: bucketUrl,
        });

        console.log("THE RESPOSNE FROM THE COMMAND REQUEST", response);
    }
}
