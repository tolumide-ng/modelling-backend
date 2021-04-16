interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
    readonly mimetype: string;
}

declare var File: {
    prototype: File;
    new (
        fileBits: BlobPart[],
        fileName: string,
        options?: FilePropertyBag,
    ): File;
};
