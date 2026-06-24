import FutureEvent from ".";
// promise
const { promise, resolve } = Promise.withResolvers();
if (isDOMContentLoaded())
    resolve();
else
    document.addEventListener('DOMContentLoaded', resolve, true);
// is
function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}
// future
const DOMContentLoaded = new FutureEvent(promise, isDOMContentLoaded);
export default DOMContentLoaded;
//# sourceMappingURL=DOMContentLoaded.js.map