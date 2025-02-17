export default async function executeJS<T>(code: string): Promise<T> {

    const file = new Blob([code], { type: 'application/javascript' });
    const url  = URL.createObjectURL(file);

    const result = (await import(/* webpackIgnore: true */ url));
    
    URL.revokeObjectURL(url);

    return result as unknown as T;
}