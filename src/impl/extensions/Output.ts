// register extension to LISSBase
import { Mixin  } from "@MWL/extensions/core/mixins/types";
import { WithExt, registerLISSExtension} from "./Base";
import { Cstr } from "@MWL/types/Cstr";

import Output, { WithOutput } from "@MWL/extensions/Output";

export default Output;

declare module "./Base" {
    interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                    > {

        WithOutput<T extends Record<string, any> = {}>(props?: T):
                NextBuilder<B, Acc, (props: T) => typeof WithOutput<B, T>>
    }
}
registerLISSExtension(Output);