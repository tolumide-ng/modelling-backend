import fs from "fs";
import chai, { expect } from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { Request, Response, NextFunction } from "express";
import { SSEvents } from "../../controllers/conversion";
import {
    VALID_CONVERT_TARGETS,
    NON_EXISTENT_ID,
    INVALID_CONVERT_TARGET,
} from "../utils";

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe.only("GET /stream/:id", () => {
    let res;

    beforeEach(async () => {
        await Upload.destroy({ truncate: true });
    });

    it("should return an 404 status code", async () => {
        // const TEST_FILE_NAME = "testFile.shapr";
        // const response = await BaseRepository.create(Upload, {
        //     fileUrl: "longFileUrlFromABucket",
        //     fileName: TEST_FILE_NAME,
        // });
        // const { fileId } = await response.get({ plain: true });
        const res = await server().get(`/stream/${INVALID_CONVERT_TARGET}`);

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Resource not found");

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(0);
    });

    it.only("should successfully convert the uploaded file", async () => {
        // const stubSSE = sinon.stub(SSEvents, "")
    });
});
