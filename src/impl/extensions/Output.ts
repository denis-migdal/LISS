// register extension to LISSBase
import { Mixin  } from "@MWL/mixins/types";
import { WithExt, registerLISSExtension} from "./Base";
import { Cstr } from "@MWL/types/Cstr";

import Output from "@MWL/extensions/Output";

export default Output;

declare module "./Base" {
    interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                    > {

        WithOutput: WithExt<B, Acc, typeof Output>
    }
}
registerLISSExtension(Output);