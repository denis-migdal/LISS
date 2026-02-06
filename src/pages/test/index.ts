import "@LISS/components/code/code-editor";
import { getInput } from "@LISS/impl/extensions/WithInput";
import { getOutput } from "@LISS/impl/extensions/WithOutput";
import createElement from "@LISS/utils/DOM/createElement";

const code = createElement("code-editor");

const input = getInput<string>(code);

input.value = "console.log('ok')\n    console.log('ok');";

const output = getOutput<string>(code);

output.listen( () => {
    console.warn("changed");
});

document.querySelector('main')!.prepend(code);