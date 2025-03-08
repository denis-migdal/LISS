import BOOLEAN_PARSER from "./BOOLEAN_PARSER";
import COLOR_PARSER from "./COLOR_PARSER";
import FSTRING_ARRAY_PARSER from "./FSTRING_ARRAY_PARSER";
import FSTRING_PARSER from "./FSTRING_PARSER";
import INTEGER_PARSER from "./INTEGER_PARSER";
import NUMBER_PARSER from "./NUMBER_PARSER";
import RAWDATA_PARSER from "./RAWDATA_PARSER";
import STRING_PARSER from "./STRING_PARSER";

export default {
    boolean: BOOLEAN_PARSER,
    number : NUMBER_PARSER,
    integer: INTEGER_PARSER,
    rawjs  : RAWDATA_PARSER,
    string : STRING_PARSER,
    color  : COLOR_PARSER,
    "f-string"  : FSTRING_PARSER,
    "f-string[]": FSTRING_ARRAY_PARSER,
}