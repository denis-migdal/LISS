const converter = document.createElement('span');

export default function encodeHTML(text: string) {
	converter.textContent = text;
	return converter.innerHTML;
}