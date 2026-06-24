export default async function define(tagname, Klass) {
    if (hasDefineAfter(Klass) && !Klass.defineAfter.isDone)
        await Klass.defineAfter;
    customElements.define(tagname, Klass);
}
function hasDefineAfter(Klass) {
    return "defineAfter" in Klass;
}
//# sourceMappingURL=define.js.map