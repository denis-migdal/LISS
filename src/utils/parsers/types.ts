export type Template<T> = [TemplateStringsArray, ...string[]]|[T];

export function isTemplateString(
                                    raw: [unknown, ...unknown[]]
                                ): raw is [TemplateStringsArray, ...string[]] {
    return Array.isArray(raw[0]);
}