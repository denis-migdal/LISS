import "@LISS/pages/skeleton/base";
//import "@LISS/components/playground/liss-playground/";
import { initMenu } from "@LISS/components/page/menu";

const menu = require("!!raw-loader!/src/pages/content.txt").default;
initMenu(menu);