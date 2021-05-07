import fs from "fs";
import chai, { expect } from "chai";
import sinon, { restore } from "sinon";
import chaiHttp from "chai-http";
import app from "../../index";
import { config } from "dotenv";
import { BaseRepository } from "../../baseRepository";
import Upload from "../../database/models/upload";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { AmazonS3 } from "../../helpers/bucket/awsS3";
import { Request, Response, NextFunction } from "express";

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe("POST /upload", () => {
    beforeEach(async () => {
        await Upload.destroy({ truncate: true });
    });

    it("Should return unsupported media validation error", async () => {
        fs.writeFileSync("file.txt", "welcome to the new age");

        const res = await server()
            .post("/upload")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .field("Content-Type", "multipart/form-data")
            .attach("convertFile", "./file.txt");

        fs.unlink("./file.txt", (err) => {});

        expect(res.body.message).to.includes("Unsupported Media Type");
        expect(res.status).to.equal(415);
    });

    it("Should return error when file is not attached", async () => {
        const res = await server()
            .post("/upload")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send({});

        expect(res.body.message).to.equal(
            "Please provide a supported file type",
        );
        expect(res.status).to.equal(400);
    });

    it("Should fail to add uploaded file to cloud storage", async () => {
        const stubUploadToAws = sinon
            .stub(AmazonS3.prototype, "uploadOriginal")
            .callsFake(
                async (req: Request, res: Response, next: NextFunction) => {
                    return ResponseGenerator.sendError(
                        res,
                        400,
                        "Please try again",
                    );
                },
            );

        fs.writeFileSync("file.shapr", "welcome to the new age");

        const res = await server()
            .post("/upload")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .field("Content-Type", "multipart/form-data")
            .attach("convertFile", "./file.shapr");

        fs.unlink("./file.shapr", (err) => {});

        expect(res.body.message).to.equal("Please try again");
        expect(res.status).equal(400);

        stubUploadToAws.restore();
    });

    it("Should successfully upload a file", async () => {
        const initialTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(initialTotalUploads.length).to.equal(0);

        const awsInstance = new AmazonS3();

        const stubUploadToAws = sinon
            .stub(AmazonS3.prototype, "uploadOriginal")
            .callsFake(
                async (req: Request, res: Response, next: NextFunction) => {
                    return new Promise((resolve, reject) => {
                        req.bucketUrl = "FakeUrlForTheFileLocation";
                        resolve;
                        next();
                    });
                },
            );

        const fileName = "file.shapr";

        fs.writeFileSync(fileName, "welcome to the new age");

        const res = await server()
            .post("/upload")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .field("Content-Type", "multipart/form-data")
            .attach("convertFile", `./${fileName}`);

        fs.unlink(`./${fileName}`, (err) => {});

        const currentTotalUploads = await BaseRepository.findAll(Upload, {});
        expect(currentTotalUploads.length).to.equal(1);

        expect(res.body.data.fileName).to.equal(fileName.split(".")[0]);
        expect(res.body.data.message).to.equal("File Upload Success");

        stubUploadToAws.restore();
    });
});
