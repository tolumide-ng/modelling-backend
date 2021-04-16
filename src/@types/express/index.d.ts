declare global {
    namespace Express {
        export interface Request {
            bucketUrl: string;
        }
    }
}
