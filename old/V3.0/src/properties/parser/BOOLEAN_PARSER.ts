export default function BOOLEAN_PARSER(value: string) {

    if( value === "true" )
        return true;
    if( value === "false")
        return false;

    throw new Error('NOT IMPLEMENTED')
}