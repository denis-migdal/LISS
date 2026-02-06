export function getComponentDir() {
    const line = new Error().stack!.split('\n')[1+2];
    const beg  = line.indexOf(':///')  + 3;
    const end  = line.lastIndexOf('/') + 1;
    
    return line.slice(beg, end);
}

export function getComponentName() {

    const line = new Error().stack!.split('\n')[1+2];
    const end  = line.lastIndexOf('/');
    const beg  = line.lastIndexOf('/', end - 1) + 1;
    
    return line.slice(beg, end);
}

export default async function loadFile(file: string) {
    const line = new Error().stack!.split('\n')[1+2];
    const beg  = line.indexOf(':///')  + 3;
    const end  = line.lastIndexOf('/') + 1;
    
    const dir = line.slice(beg, end);

    return await Deno.readTextFile( dir + file );
}