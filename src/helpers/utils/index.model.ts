export interface dirtyObjDef {
    [key: string]: null | Object | string | number;
}

export interface cleanObjDef {
    [key: string]: Object | string | number;
}
