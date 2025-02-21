export default function isTemplateString(raw: [unknown, ...unknown[]]): raw is [TemplateStringsArray, ...string[]] {
    return Array.isArray(raw[0]);
}