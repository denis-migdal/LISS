/*
 1. override fetch/import/whatever
    -> expliquer le fonctionnement (sinon je vais m'y perdre)
    -> v3 directory ?
        -> sources inside ?
 2. CSS
 3. HTML in fct attr
 4. Fct interne
 5. Conseils
 6. JS... 
 7. pure JS (?)
*/

//TODO: dev log : parfois dossiers bien major rewrite ou API vers //

// example : playground v3 (?)
    // liss-version="v3"
    // liss-v3="auto" (c'est la v3 qu'il faut utiliser)
// unit test de l'exemple ajouté
// => continue other examples

// TODO: in playground brython src only if brython
// TODO: remove v2 (autodir) + v2 fcts

// DOCS
    // doc/fr/auto.md
    // Ctrler/LifeCycle
    // doc/en (obs ?)
    // README.md

// TODO: auto-mode (all with auto...)
    // TODO: true auto-mode in tests (change Brython...)
        // testv3
            // default HTML in test if (null)...
            // like playground (?) => different file for cleaner code ?
    // files="js,ts,bry,html" - default (html+css+js) ?
        // override fetch (ofc) [sw override ?]
        // build default js (with ${}) support

// docs (+ examples playground/tests // Bry/JS).
    // non-auto first.
        // extends (LISS Base)
        // LISS({}) opts.
        // define.
        // API... for better suggestions.
        // rules...

// TODO: contentGenerator
// TODO: docs (ofc)

// TODO: utils + signals + DOMContentLoaded before... + upgrade children in cstr ?
    // build
    // remove events + qs ?
    // TODO: state (internal state)
    // TODO: bliss
    // TODO: css--[prop_name].
    // TODO: sharedCSS

// TODO: upgrade
    // TODO: get upgraded ?
    // TODO: upgrade ++ > definition order if inside child and available.
    // TODO: defined : visibility: hidden until defined ?
        // TODO: loader customElement (replaceWith ?)


// TODO: playground
    // TODO: facultative HTML in editor/playground
    // TODO: show error...
    // TODO: debounce/throttle editor...

import ContentGenerator from "../V2/ContentGenerator";

// Only extends HTMLElement, else issues :
    // not supported by all browsers.
    // may not support shadowRoot -> then init can be troublesome.
    // be careful when trying to build : createElement call cstr.
    // if possible, do not expect content (attr good ? no children ?)

// Wait DOM ContentLoaded, else will lack children (e.g. blocking script)
// Upgrade order is def order => do not depend father/children.
    // father should upgrade children ? (as it listen its children) ?
        // (can't listen children father)
        // upgrade fct
        // children can't assume he is in a (compatible) father.
            // attach()/detach() // onAttach() / onDetach()
                // add ?

// defer/after DOMContentLoaded for querying DOM
// WTF for custom elements???

class LISSBase extends HTMLElement {

    protected readonly content: ShadowRoot;

    constructor(generator?: ContentGenerator) {
        super();

        this.content = this.attachShadow({mode: "open"});
        if(generator !== undefined)
            generator.fillContent(this.content);
    }

    // for better suggestions
    get controler(): Omit<this, keyof HTMLElement> {
        return this;
    }

    get host(): HTMLElement {
        return this;
    }
}

type Cstr<T> = new(...args:any[]) => T
type LISSv3_Opts<T extends Cstr<ContentGenerator> > = {
    content_generator: T,
} & ConstructorParameters<T>[0];

//  builder
export default function LISSv3<T extends Cstr<ContentGenerator> = Cstr<ContentGenerator>>(opts: Partial<LISSv3_Opts<T>> = {}) {
    
    const content_generator = opts.content_generator ?? ContentGenerator;
    // @ts-ignore
    const _generator: ContentGenerator = new content_generator(opts);
    
    return class _LISS extends LISSBase {
        constructor(generator = _generator) {
            super(generator);
        }
    }
}