import STRING_PARSER from "../properties/parser/STRING_PARSER";
import LISSProperties from "./LISSProperties";


class X<T extends Record<string, unknown>> extends LISSProperties<T> {

    static override PropertiesDescriptor = {
        name: {
            parser: STRING_PARSER
        }
    };
}

// inherit...
// attach/detach
    // parent signal (?)
// onChartUpdate