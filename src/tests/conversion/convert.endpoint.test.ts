import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import {
    VALID_CONVERT_TARGETS,
    NON_EXISTENT_ID,
    INVALID_CONVERT_TARGET,
} from "../utils";

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe("PATCH /convert/:target/:id", () => {
    beforeEach(async () => {
        await Upload.destroy({ truncate: true });
    });

    it("Should return a 404 status code: Resource not found", async () => {
        const initialTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(initialTotalUploads.length).to.equal(0);

        const res = await server().patch(
            `/convert/${VALID_CONVERT_TARGETS[0]}/${NON_EXISTENT_ID}`,
        );

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Resource not found");

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(0);
    });

    it("Should return a 415 status code: Unsupported Media", async () => {
        const response = await BaseRepository.create(Upload, {
            fileUrl: "longFileUrlFromABucket",
            fileName: "testFile.shapr",
        });

        const { fileId } = await response.get({ plain: true });

        const initialTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(initialTotalUploads.length).to.equal(1);

        const res = await server().patch(
            `/convert/${INVALID_CONVERT_TARGET}/${fileId}`,
        );

        expect(res.status).to.equal(415);
        expect(res.body.message).to.equal("Unsupported Media Type");

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(1);
    });

    it("Should return a 200 status code", async () => {
        const TEST_FILE_NAME = "testFile.shapr";
        const response = await BaseRepository.create(Upload, {
            fileUrl: "longFileUrlFromABucket",
            fileName: TEST_FILE_NAME,
        });

        const { fileId } = await response.get({ plain: true });

        const initialTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(initialTotalUploads.length).to.equal(1);

        const res = await server().patch(
            `/convert/${VALID_CONVERT_TARGETS[0]}/${fileId}`,
        );

        expect(res.status).to.equal(200);
        expect(res.body.data.targetName).to.includes(TEST_FILE_NAME);

        const getInfo = await BaseRepository.findOneByField(Upload, {
            fileId,
        });
        const { fileName, target } = getInfo;

        expect(target).to.equal(VALID_CONVERT_TARGETS[0]);
        expect(fileName).to.includes(TEST_FILE_NAME);
    });
});
