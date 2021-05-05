import fs from "fs";
import chai, { expect } from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import { SSEvents } from "../../controllers/conversion";
import { VALID_CONVERT_TARGETS, INVALID_CONVERT_TARGET } from "../utils";
import { AmazonS3 } from "../../helpers/awsS3";
import { ConversionHelper } from "../../helpers/conversion";

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
        // seed database with the file to be converted
        const TEST_FILE_NAME = "testFile.shapr";
        const createUpload = await BaseRepository.create(Upload, {
            fileUrl: "longFileUrlFromABucket",
            fileName: TEST_FILE_NAME,
            target: VALID_CONVERT_TARGETS[1],
        });

        // stubs aws uploadOriginal method
        const stubAwsS3UploadConverted = sinon
            .stub(AmazonS3.prototype, "uploadConverted")
            .callsFake(async (message: any) => {
                return new Promise((resolve, reject) => {
                    resolve("fakeConvertedUrl");
                });
            });

        ConversionHelper.CALL_INTERVAL = 10;
        ConversionHelper.INCREASE_BY = 50;
        const { fileId } = await createUpload.get({ plain: true });

        const spySSESend = sinon.spy(SSEvents.prototype, "send");

        const res = await server().get(`/stream/${fileId}`);

        expect(res.status).to.equal(200);
        spySSESend.calledWith({ status: 50 });

        stubAwsS3UploadConverted.restore();
        spySSESend.restore();
    });
});
