// register extension to LISSBase
import { Mixin  } from "@MWL/extensions/core/mixins/types";
import { registerLISSExtension} from "./Base";
import { Cstr } from "@MWL/types/Cstr";

import Input, {WithInput} from "@MWL/extensions/Input";

export default Input;

declare module "./Base" {
    interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                    > {

        WithInput<T extends Record<string, any> = {}>(props?: T):
            NextBuilder<B, Acc, (props: T) => typeof WithInput<B, T>>
    }
}
registerLISSExtension(Input);