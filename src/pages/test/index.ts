import CodeEditor from "@LISS/components/code/code-editor";

const code = new CodeEditor("ts");

code.input.value = "console.log('ok')\n    console.log('ok');";

document.querySelector('main')!.prepend(code);