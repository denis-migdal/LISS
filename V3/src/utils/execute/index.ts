import executeBry from "./bry";
import executeJS from "./js";

const EXEC = {
    js : executeJS,
    bry: executeBry
}

export default async function execute<T>(code: string, type: "js"|"bry", origin: string): Promise<T> {

    return await EXEC[type]<T>(code, origin);
}