import { Cstr } from "@MWL/types/Cstr";

import Mix                   from "@MWL/extensions/core/mixins/mixer";
import { Mixin, WithMixins } from "@MWL/extensions/core/mixins/types";

import Bare    from "./Bare";

export interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                         Acc extends Mixin[] = []
                        > {

}

export type NextBuilder<B   extends Cstr,
                        Acc extends Mixin[],
                        E   extends (...args: any[]) => Mixin
            > = WithMixins    <B, [...Acc, ReturnType<E>]>
              & LISSMixBuilder<B, [...Acc, ReturnType<E>]>;

type LISSMixBuilder<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                > = WithMixins<B, Acc> & {

    With<M extends Mixin>(mixin: M): WithMixins    <B, [...Acc, M]>
                                   & LISSMixBuilder<B, [...Acc, M]>;

} & LISSExt<B, Acc>;

export type WithExt<
                B   extends Cstr,
                Acc extends Mixin[],
                Ext extends (...args: any[]) => Mixin,
            > = (...opts: Parameters<Ext>) => NextBuilder<B, Acc, Ext>;

const LISSBase = (Mix(HTMLElement) as any as LISSMixBuilder).With(Bare());
export default LISSBase;

export function registerLISSExtension(Ext: (...args: any[]) => Mixin) {
    // @ts-ignore
    LISSBase[`With${Ext.name}`] = function(...args: any[]) {
        return Ext(...args)(this);
    }
}