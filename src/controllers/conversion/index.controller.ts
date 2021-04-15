import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import db from "../../database/models";
import { BaseRepository } from "../../baseRepository";

export class ConversionController extends ResponseGenerator {
    static async uploadFile(req: Request, res: Response) {}
}
