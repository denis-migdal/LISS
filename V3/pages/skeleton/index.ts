import "@LISS/pages/skeleton/base";
//import "@LISS/components/playground/liss-playground/";
import { initMenu } from "@LISS/components/page/menu";


const menu = __LOAD_FILE__("./src/pages/content.txt");
initMenu(menu);