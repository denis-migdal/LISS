import Bare    from "./Bare";
import Content from "./Content";
import Style   from "./Style";

export {Bare, Content, Style};

// LISSBase declaration :

import Mix  from "@MWL/mixins/mixer";
import { Mixin, WithMixins } from "@MWL/mixins/types";

import { Cstr } from "@MWL/types/Cstr";

type NextBuilder<B   extends Cstr,
                 Acc extends Mixin[],
                 E   extends (...args: any[]) => Mixin
            > = WithMixins    <B, [...Acc, ReturnType<E>]>
              & LISSMixBuilder<B, [...Acc, ReturnType<E>]>;

//TODO: plugin interface.
type LISSMixBuilder<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                > = WithMixins<B, Acc> & {

    With<M extends Mixin>(mixin: M): WithMixins    <B, [...Acc, M]>
                                   & LISSMixBuilder<B, [...Acc, M]>;

    
    WithContent(...opts: Parameters<typeof Content>)
                        : NextBuilder<B, Acc, typeof Content>
}

const LISSBase = (Mix(HTMLElement) as any as LISSMixBuilder).With(Bare());

function registerLISSExtension(Ext: (...args: any[]) => Mixin) {
    // @ts-ignore
    LISSBase[`With${Ext.name}`] = function(...args: any[]) {
        return Ext(args)(this);
    }
}

registerLISSExtension(Content);

export {LISSBase};

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