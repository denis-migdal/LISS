export default function isPageLoaded() {
    return document.readyState === "complete"
}

/*
export function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}*/