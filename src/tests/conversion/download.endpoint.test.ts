import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import { NON_EXISTENT_ID, VALID_CONVERT_TARGETS } from "../utils";

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe("GET /stream/:id", () => {
    beforeEach(async () => {
        await Upload.destroy({ truncate: true });
    });

    it("Should return 404 resouce not found", async () => {
        const res = await server().get(`/download/${NON_EXISTENT_ID}`);

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Resource not found");

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(0);
    });

    it("Should return the converted file for download", async () => {
        const TEST_FILE_NAME = "testFile.shapr";
        const createObj = {
            fileUrl: "longFileUrlFromABucket",
            fileName: TEST_FILE_NAME,
            targetUrl: "aws.longUrl.cloudStorageLocation_iges",
            target: VALID_CONVERT_TARGETS[1],
        };
        const response = await BaseRepository.create(Upload, createObj);

        const { fileId } = await response.get({ plain: true });

        const res = await server().get(`/download/${fileId}`);

        expect(res.status).to.equal(200);
        expect(res.body.data.convertedFile).to.equal(createObj.targetUrl);

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(1);
    });
});
