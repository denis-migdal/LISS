//TODO...
await LISS.whenDefined('cstr-params-host');
const Host = LISS.getHostCstr('cstr-params-host')

const host = new Host("Host");
document.body.append( host );