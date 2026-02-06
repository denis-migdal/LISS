export {default as Bare   } from "./Bare";
export {default as Content} from "./Content";
export {default as Style} from "./Style";

import Bare from "./Bare";
import Mix  from "@MWL/mixins/mixer";
export const LISSBare = Mix(HTMLElement).With(Bare());

/*
//temporary typing tests
import { Cstr } from "@MWL/types/Cstr";
import { createExtension } from "@MWL/mixins/mixer";
import Content from "./Content";
import template from "@LISS/utils/parsers/template";

class X {
    protected f1 = 43;
}

function mix1<B extends Cstr>(base: B, o: number) {
    return class Y extends base {
        protected f2 = o;
    }
}
function mix2<B extends Cstr>(base: B) {
    return class Z extends base {
        protected f3 = 43;
    }
}

const mixA = createExtension(mix1);
const mixB = createExtension(mix2);

const t = template("<div></div>")

class Z extends LISSBare {
    foo(){
        this.api.foo
    }
}

class Y extends Mix(X).With(mixA(3))
                      .With(Content(t))
                      .With(mixB()) {
    foo() {
        this.content
    }
}
*/