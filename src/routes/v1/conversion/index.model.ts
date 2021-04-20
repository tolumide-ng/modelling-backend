declare namespace Express {
    export interface Request {
        bucketUrl: string;
        fileName: string;
    }
}

export type targetTypeDef = "STEP" | "STL" | "IGES";
