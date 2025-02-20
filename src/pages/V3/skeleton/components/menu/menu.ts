const body = document.body;
const menu_area  = document.createElement('div')!;
const menu_pages = document.createElement('div')!;
const menu_page  = document.createElement('div')!;

menu_page.classList.add('menu_page');
menu_pages.classList.add('menu_pages');
menu_area.classList.add('menu_area');


// Build page menu
// Update page menu
// Submenu


menu_area.append(menu_pages, menu_page);
     body.prepend(menu_area);

type MenuNode<T extends Record<string,any> = {}> = {
    text    : string,
    href    : string,
    level   : number,
    parent  : null|MenuNode<T>,
    children: MenuNode<T>[]
} & T;

type PageMenuNode  = MenuNode<{html: HTMLElement}>;
type PagesMenuNode = MenuNode<{dir: string}>;

// @ts-ignore
import content  from "!!raw-loader!/content.txt";
import { rootdir } from "pages/V3/skeleton/components/playground-area/PlaygroundArea";

function buildPagesMenu(content: string) {

    const root_dir = rootdir + "/dist/dev/pages/";

    const root: PagesMenuNode = {
        dir     : root_dir,
        text    : "",
        href    : root_dir, // should not be used.
        level   : 1,
        parent  : null,
        children: []
    }

    const current = new Array<PagesMenuNode>();
    current[1] = root;

    for(let item of content.split("\n") ) {

        const offset = item.search(/(\-|\+)/);
        const level = offset / 4 + 2;

        const sep = item.indexOf(":");

        const target = item.slice(offset+2, sep);
        const text   = item.slice(sep+1);

        const parent = current[level-1];

        const isVirtual = item[offset] === "+";

        const dir  = parent.dir + target + "/";
        const href = (isVirtual ? null : dir) as string;  // h4ck

        const node = {
            text,
            dir,
            href,
            level,
            parent,
            children: []
        };

        if( ! isVirtual && parent.href === null) {

            let cur = parent;
            do {
                cur.href = node.href;
                cur = cur.parent!;
            } while(cur.href === null);
        }

        parent.children.push(node);
        current[level] = node;
    }

    return root;
}


function buildPageMenu(parent: PageMenuNode|null = null) {
    
    const h1 = document.querySelector('h1')!;

    const root: PageMenuNode = {
        html    : h1,
        href    : `#${h1.id}`,
        text    : getTitlePrefix(1, 1) + h1.textContent!, //TODO: get...
        level   : 1,
        parent  : null,
        children: []
    }

    let curpos = root;

    const titles = document.querySelectorAll<HTMLElement>("h2, h3, h4");

    for(let title of titles) {
        const level = +title.tagName.slice(1);
    
        while( level <= curpos.level )
            curpos = curpos.parent!;

        const elem: PageMenuNode = {
            html    : title,
            href    : `#${title.id}`,
            text    : getTitlePrefix(level, curpos.children.length) + title.textContent!,
            level,
            children: [],
            parent: curpos
        };

        curpos.children.push(elem);
        curpos = elem;
    }

    return root;
}

function searchCurPageHeader(htree: PageMenuNode, position: number): null | PageMenuNode {

    const headers = htree.children;

    for(let i = headers.length - 1; i >= 0; --i) {
        if( headers[i].html.offsetTop <= position + 2.5*14 + 5 )
            return searchCurPageHeader(headers[i], position) ?? headers[i];
    }

    return null;
}

function searchCurPagesHeader(htree: PagesMenuNode): PagesMenuNode {

    const curpage = window.location.pathname;
    let cur = htree;
    
    while(true) {
        const find = cur.children.find( (node) => curpage.startsWith(node.dir) )
        if(find === undefined)
            return cur;
        cur = find;
    }
}

const hid = [
    [],
    ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X" ],
    ["1", "2" , "3"  , "4" , "5", "6" , "7"  , "8"   , "9" , "10"],
    ["a", "b" , "c"  , "d" , "e", "f" , "g"  , "h"   , "i" , "j" ],
]

function getTitlePrefix(level: number, idx: number) {

    if( level >= hid.length )
        return "";

    const num = hid[level][idx];
    return `${num}. `;
}


function buildMenu(nodes: MenuNode[]) {

    const menu = document.createElement("div");
    menu.classList.add("menu");

    menu.append( ... nodes.map( (s) => {
        const item = document.createElement("a");
        item.textContent= s.text;
        item.setAttribute("href", s.href);
        return item;
    }) );

    return menu;
}

function generateMenuHTML(target: MenuNode) {

    let headers = [];

    let cursor = target;

    while( cursor !== null) {
        headers.push(cursor);
        cursor = cursor.parent!;
    }

    const html = headers.reverse().map( (hnode) => {

        const h_html = document.createElement("span");

        const link = document.createElement("a");
        link.textContent = hnode.text;
        link.setAttribute('href', hnode.href);
        
        h_html.append(link);

        if( hnode.parent !== null) {
            const menu = buildMenu(hnode.parent.children);
            h_html.append(menu);
        }

        return h_html;
    });

    if( target.children.length !== 0) {
        const empty = document.createElement("span");

        empty.append( buildMenu(target.children) );

        html.push(empty)
    }

    return html;
}

function updatePageMenu(menu: PageMenuNode) {

    //TODO: scale...
    const last = searchCurPageHeader( menu, document.documentElement.scrollTop)!;

    const html = generateMenuHTML(last ?? menu);

    menu_page.replaceChildren(...html);
}

const cur_page =  searchCurPagesHeader(buildPagesMenu(content));
menu_pages.replaceChildren(...generateMenuHTML(cur_page) );

const idx = cur_page.parent!.children.indexOf(cur_page);
document.body.style.setProperty('counter-set', `h1 ${idx}` );

const hasH1 = document.body.querySelector("h1") !== null;

if( hasH1 ) {

    const menu = buildPageMenu();

    window.addEventListener('scroll', () => updatePageMenu(menu) );
    updatePageMenu(menu);
}

// force module recognition to avoid "Cannot redeclare block-scoped variable" error.
export {}