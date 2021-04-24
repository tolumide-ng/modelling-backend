import fs from "fs";
import chai, { expect } from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { Request, Response } from "express";
import { ConversionController } from "../../controllers/conversion";
import { VALID_CONVERT_TARGETS, INVALID_CONVERT_TARGET } from "../utils";

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe("GET /stream/:id", () => {
    beforeEach(async () => {
        await Upload.destroy({ truncate: true });
    });

    it("should return an 404 status code", async () => {
        const res = await server().get(`/stream/${INVALID_CONVERT_TARGET}`);

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Resource not found");

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(0);
    });

    it("should successfully convert the uploaded file", async () => {
        const stubConversion = sinon
            .stub(ConversionController, "streamConversion")
            .callsFake(async (req: Request, res: Response) => {
                return new Promise((resolve, reject) => {
                    return ResponseGenerator.sendSuccess(res, 200, {
                        message: "Success",
                    });
                });
            });

        const TEST_FILE_NAME = "testFile.shapr";
        const response = await BaseRepository.create(Upload, {
            fileUrl: "longFileUrlFromABucket",
            fileName: TEST_FILE_NAME,
            target: VALID_CONVERT_TARGETS[1],
        });

        const { fileId } = await response.get({ plain: true });

        const res = await server().get(`/stream/${fileId}`);

        expect(res.status).to.equal(200);

        stubConversion.restore();
    });
});
