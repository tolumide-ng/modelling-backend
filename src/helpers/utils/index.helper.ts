import { dirtyObjDef, cleanObjDef } from "../utils";

export class Utils {
    static removeNull(dirtyObj: dirtyObjDef): cleanObjDef {
        const cleanObj: cleanObjDef = {};

        Array.from(Object.keys(dirtyObj)).forEach((key) => {
            const currentValue = dirtyObj[key];

            if (currentValue) {
                cleanObj[key] = currentValue;
            }
        });

        return cleanObj;
    }
}
