import executeJS from "./js";

export default async function execute<T>(code: string, type: "js"): Promise<T> {

    if( type === "js" )
        return await executeJS<T>(code);

    throw new Error('');
}