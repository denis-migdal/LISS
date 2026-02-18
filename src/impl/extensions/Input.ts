// register extension to LISSBase
import { Mixin  } from "@MWL/mixins/types";
import { WithExt, registerLISSExtension} from "./Base";
import { Cstr } from "@MWL/types/Cstr";

import Input from "@MWL/extensions/Input";

export default Input;

declare module "./Base" {
    interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                    > {

        WithInput: WithExt<B, Acc, typeof Input>
    }
}
registerLISSExtension(Input);