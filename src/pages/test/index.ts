import "@LISS/components/code/code-editor";
import { getInput } from "@LISS/src/extensions/WithInput";
import { getOutput } from "@LISS/src/extensions/WithOutput";
import createElement from "@LISS/src/utils/DOM/createElement";

const code = createElement("code-editor");

const input = getInput<string>(code);

input.value = "console.log('ok')\n    console.log('ok');";

const output = getOutput<string>(code);

output.listen( () => {
    console.warn("changed");
});

document.querySelector('main')!.prepend(code);