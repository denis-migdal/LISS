import "@LISS/pages/skeleton/base";
import "@LISS/components/playground/liss-playground/";
import { initMenu } from "@LISS/components/page/menu";


// @ts-ignore
import menu  from "!!raw-loader!/V3/pages/content.txt";
initMenu(menu);