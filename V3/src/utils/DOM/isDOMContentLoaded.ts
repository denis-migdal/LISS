export default function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}