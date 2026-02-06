export {default as Bare   } from "./Bare";
export {default as Content} from "./Content";
export {default as Style} from "./Style";

import {WithBare} from "./Bare";

export const LISSBare = WithBare(HTMLElement);

/* temporary typing tests
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

class Y extends Mix(X).With(mixA(3))
                      .With(mixB()) {
    foo() {
        this.
    }
}
*/