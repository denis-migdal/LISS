export default function isDefined(elem: string|(new(...args:any[])=>HTMLElement)): boolean {
    
    if( typeof elem === "string")
        return customElements.get(elem) !== undefined;

    return customElements.getName(elem) !== null;
}