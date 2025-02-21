/******/ var __webpack_modules__ = ({

/***/ "./V3/pages/skeleton/components/highlight.min.js":
/*!*******************************************************!*\
  !*** ./V3/pages/skeleton/components/highlight.min.js ***!
  \*******************************************************/
/***/ ((module) => {

/*!
  Highlight.js v11.10.0 (git: 366a8bd012)
  (c) 2006-2024 Josh Goebel <hello@joshgoebel.com> and other contributors
  License: BSD-3-Clause
 */
var hljs=function(){"use strict";function e(t){
return t instanceof Map?t.clear=t.delete=t.set=()=>{
throw Error("map is read-only")}:t instanceof Set&&(t.add=t.clear=t.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(t),Object.getOwnPropertyNames(t).forEach((n=>{
const i=t[n],s=typeof i;"object"!==s&&"function"!==s||Object.isFrozen(i)||e(i)
})),t}class t{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function n(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function i(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t]
;return t.forEach((e=>{for(const t in e)n[t]=e[t]})),n}const s=e=>!!e.scope
;class o{constructor(e,t){
this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){
this.buffer+=n(e)}openNode(e){if(!s(e))return;const t=((e,{prefix:t})=>{
if(e.startsWith("language:"))return e.replace("language:","language-")
;if(e.includes(".")){const n=e.split(".")
;return[`${t}${n.shift()}`,...n.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")
}return`${t}${e}`})(e.scope,{prefix:this.classPrefix});this.span(t)}
closeNode(e){s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}const r=(e={})=>{const t={children:[]}
;return Object.assign(t,e),t};class a{constructor(){
this.rootNode=r(),this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const t=r({scope:e})
;this.add(t),this.stack.push(t)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){
return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),
t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
a._collapse(e)})))}}class c extends a{constructor(e){super(),this.options=e}
addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){
this.closeNode()}__addSublanguage(e,t){const n=e.root
;t&&(n.scope="language:"+t),this.add(n)}toHTML(){
return new o(this,this.options).value()}finalize(){
return this.closeAllNodes(),!0}}function l(e){
return e?"string"==typeof e?e:e.source:null}function g(e){return h("(?=",e,")")}
function u(e){return h("(?:",e,")*")}function d(e){return h("(?:",e,")?")}
function h(...e){return e.map((e=>l(e))).join("")}function f(...e){const t=(e=>{
const t=e[e.length-1]
;return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}
})(e);return"("+(t.capture?"":"?:")+e.map((e=>l(e))).join("|")+")"}
function p(e){return RegExp(e.toString()+"|").exec("").length-1}
const b=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
;function m(e,{joinWith:t}){let n=0;return e.map((e=>{n+=1;const t=n
;let i=l(e),s="";for(;i.length>0;){const e=b.exec(i);if(!e){s+=i;break}
s+=i.substring(0,e.index),
i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?s+="\\"+(Number(e[1])+t):(s+=e[0],
"("===e[0]&&n++)}return s})).map((e=>`(${e})`)).join(t)}
const E="[a-zA-Z]\\w*",x="[a-zA-Z_]\\w*",w="\\b\\d+(\\.\\d+)?",y="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",_="\\b(0b[01]+)",O={
begin:"\\\\[\\s\\S]",relevance:0},v={scope:"string",begin:"'",end:"'",
illegal:"\\n",contains:[O]},k={scope:"string",begin:'"',end:'"',illegal:"\\n",
contains:[O]},N=(e,t,n={})=>{const s=i({scope:"comment",begin:e,end:t,
contains:[]},n);s.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const o=f("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return s.contains.push({begin:h(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s
},S=N("//","$"),M=N("/\\*","\\*/"),R=N("#","$");var j=Object.freeze({
__proto__:null,APOS_STRING_MODE:v,BACKSLASH_ESCAPE:O,BINARY_NUMBER_MODE:{
scope:"number",begin:_,relevance:0},BINARY_NUMBER_RE:_,COMMENT:N,
C_BLOCK_COMMENT_MODE:M,C_LINE_COMMENT_MODE:S,C_NUMBER_MODE:{scope:"number",
begin:y,relevance:0},C_NUMBER_RE:y,END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{
t.data._beginMatch!==e[1]&&t.ignoreMatch()}}),HASH_COMMENT_MODE:R,IDENT_RE:E,
MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:{begin:"\\.\\s*"+x,relevance:0},
NUMBER_MODE:{scope:"number",begin:w,relevance:0},NUMBER_RE:w,
PHRASAL_WORDS_MODE:{
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},QUOTE_STRING_MODE:k,REGEXP_MODE:{scope:"regexp",begin:/\/(?=[^/\n]*\/)/,
end:/\/[gimuy]*/,contains:[O,{begin:/\[/,end:/\]/,relevance:0,contains:[O]}]},
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const t=/^#![ ]*\//
;return e.binary&&(e.begin=h(t,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:t,
end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},
TITLE_MODE:{scope:"title",begin:E,relevance:0},UNDERSCORE_IDENT_RE:x,
UNDERSCORE_TITLE_MODE:{scope:"title",begin:x,relevance:0}});function A(e,t){
"."===e.input[e.index-1]&&t.ignoreMatch()}function I(e,t){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function T(e,t){
t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
e.__beforeBegin=A,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function L(e,t){
Array.isArray(e.illegal)&&(e.illegal=f(...e.illegal))}function B(e,t){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function P(e,t){
void 0===e.relevance&&(e.relevance=1)}const D=(e,t)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const n=Object.assign({},e);Object.keys(e).forEach((t=>{delete e[t]
})),e.keywords=n.keywords,e.begin=h(n.beforeMatch,g(n.begin)),e.starts={
relevance:0,contains:[Object.assign(n,{endsParent:!0})]
},e.relevance=0,delete n.beforeMatch
},H=["of","and","for","in","not","or","if","then","parent","list","value"],C="keyword"
;function $(e,t,n=C){const i=Object.create(null)
;return"string"==typeof e?s(n,e.split(" ")):Array.isArray(e)?s(n,e):Object.keys(e).forEach((n=>{
Object.assign(i,$(e[n],t,n))})),i;function s(e,n){
t&&(n=n.map((e=>e.toLowerCase()))),n.forEach((t=>{const n=t.split("|")
;i[n[0]]=[e,U(n[0],n[1])]}))}}function U(e,t){
return t?Number(t):(e=>H.includes(e.toLowerCase()))(e)?0:1}const z={},W=e=>{
console.error(e)},X=(e,...t)=>{console.log("WARN: "+e,...t)},G=(e,t)=>{
z[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),z[`${e}/${t}`]=!0)
},K=Error();function F(e,t,{key:n}){let i=0;const s=e[n],o={},r={}
;for(let e=1;e<=t.length;e++)r[e+i]=s[e],o[e+i]=!0,i+=p(t[e-1])
;e[n]=r,e[n]._emit=o,e[n]._multi=!0}function Z(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw W("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
K
;if("object"!=typeof e.beginScope||null===e.beginScope)throw W("beginScope must be object"),
K;F(e,e.begin,{key:"beginScope"}),e.begin=m(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw W("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
K
;if("object"!=typeof e.endScope||null===e.endScope)throw W("endScope must be object"),
K;F(e,e.end,{key:"endScope"}),e.end=m(e.end,{joinWith:""})}})(e)}function V(e){
function t(t,n){
return RegExp(l(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(n?"g":""))
}class n{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,t){
t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),
this.matchAt+=p(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=t(m(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const t=this.matcherRe.exec(e);if(!t)return null
;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),i=this.matchIndexes[n]
;return t.splice(0,n),Object.assign(t,i)}}class s{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n
;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),
t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){
this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){
const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex
;let n=t.exec(e)
;if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{
const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}
return n&&(this.regexIndex+=n.position+1,
this.regexIndex===this.count&&this.considerAll()),n}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=i(e.classNameAliases||{}),function n(o,r){const a=o
;if(o.isCompiled)return a
;[I,B,Z,D].forEach((e=>e(o,r))),e.compilerExtensions.forEach((e=>e(o,r))),
o.__beforeBegin=null,[T,L,P].forEach((e=>e(o,r))),o.isCompiled=!0;let c=null
;return"object"==typeof o.keywords&&o.keywords.$pattern&&(o.keywords=Object.assign({},o.keywords),
c=o.keywords.$pattern,
delete o.keywords.$pattern),c=c||/\w+/,o.keywords&&(o.keywords=$(o.keywords,e.case_insensitive)),
a.keywordPatternRe=t(c,!0),
r&&(o.begin||(o.begin=/\B|\b/),a.beginRe=t(a.begin),o.end||o.endsWithParent||(o.end=/\B|\b/),
o.end&&(a.endRe=t(a.end)),
a.terminatorEnd=l(a.end)||"",o.endsWithParent&&r.terminatorEnd&&(a.terminatorEnd+=(o.end?"|":"")+r.terminatorEnd)),
o.illegal&&(a.illegalRe=t(o.illegal)),
o.contains||(o.contains=[]),o.contains=[].concat(...o.contains.map((e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((t=>i(e,{
variants:null},t)))),e.cachedVariants?e.cachedVariants:q(e)?i(e,{
starts:e.starts?i(e.starts):null
}):Object.isFrozen(e)?i(e):e))("self"===e?o:e)))),o.contains.forEach((e=>{n(e,a)
})),o.starts&&n(o.starts,r),a.matcher=(e=>{const t=new s
;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t})(a),a}(e)}function q(e){
return!!e&&(e.endsWithParent||q(e.starts))}class J extends Error{
constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}
const Y=n,Q=i,ee=Symbol("nomatch"),te=n=>{
const i=Object.create(null),s=Object.create(null),o=[];let r=!0
;const a="Could not find the language '{}', did you forget to load/include a language module?",l={
disableAutodetect:!0,name:"Plain text",contains:[]};let p={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:c};function b(e){
return p.noHighlightRe.test(e)}function m(e,t,n){let i="",s=""
;"object"==typeof t?(i=e,
n=t.ignoreIllegals,s=t.language):(G("10.7.0","highlight(lang, code, ...args) has been deprecated."),
G("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
s=e,i=t),void 0===n&&(n=!0);const o={code:i,language:s};N("before:highlight",o)
;const r=o.result?o.result:E(o.language,o.code,n)
;return r.code=o.code,N("after:highlight",r),r}function E(e,n,s,o){
const c=Object.create(null);function l(){if(!N.keywords)return void M.addText(R)
;let e=0;N.keywordPatternRe.lastIndex=0;let t=N.keywordPatternRe.exec(R),n=""
;for(;t;){n+=R.substring(e,t.index)
;const s=_.case_insensitive?t[0].toLowerCase():t[0],o=(i=s,N.keywords[i]);if(o){
const[e,i]=o
;if(M.addText(n),n="",c[s]=(c[s]||0)+1,c[s]<=7&&(j+=i),e.startsWith("_"))n+=t[0];else{
const n=_.classNameAliases[e]||e;u(t[0],n)}}else n+=t[0]
;e=N.keywordPatternRe.lastIndex,t=N.keywordPatternRe.exec(R)}var i
;n+=R.substring(e),M.addText(n)}function g(){null!=N.subLanguage?(()=>{
if(""===R)return;let e=null;if("string"==typeof N.subLanguage){
if(!i[N.subLanguage])return void M.addText(R)
;e=E(N.subLanguage,R,!0,S[N.subLanguage]),S[N.subLanguage]=e._top
}else e=x(R,N.subLanguage.length?N.subLanguage:null)
;N.relevance>0&&(j+=e.relevance),M.__addSublanguage(e._emitter,e.language)
})():l(),R=""}function u(e,t){
""!==e&&(M.startScope(t),M.addText(e),M.endScope())}function d(e,t){let n=1
;const i=t.length-1;for(;n<=i;){if(!e._emit[n]){n++;continue}
const i=_.classNameAliases[e[n]]||e[n],s=t[n];i?u(s,i):(R=s,l(),R=""),n++}}
function h(e,t){
return e.scope&&"string"==typeof e.scope&&M.openNode(_.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(u(R,_.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
R=""):e.beginScope._multi&&(d(e.beginScope,t),R="")),N=Object.create(e,{parent:{
value:N}}),N}function f(e,n,i){let s=((e,t)=>{const n=e&&e.exec(t)
;return n&&0===n.index})(e.endRe,i);if(s){if(e["on:end"]){const i=new t(e)
;e["on:end"](n,i),i.isMatchIgnored&&(s=!1)}if(s){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return f(e.parent,n,i)}function b(e){
return 0===N.matcher.regexIndex?(R+=e[0],1):(T=!0,0)}function m(e){
const t=e[0],i=n.substring(e.index),s=f(N,e,i);if(!s)return ee;const o=N
;N.endScope&&N.endScope._wrap?(g(),
u(t,N.endScope._wrap)):N.endScope&&N.endScope._multi?(g(),
d(N.endScope,e)):o.skip?R+=t:(o.returnEnd||o.excludeEnd||(R+=t),
g(),o.excludeEnd&&(R=t));do{
N.scope&&M.closeNode(),N.skip||N.subLanguage||(j+=N.relevance),N=N.parent
}while(N!==s.parent);return s.starts&&h(s.starts,e),o.returnEnd?0:t.length}
let w={};function y(i,o){const a=o&&o[0];if(R+=i,null==a)return g(),0
;if("begin"===w.type&&"end"===o.type&&w.index===o.index&&""===a){
if(R+=n.slice(o.index,o.index+1),!r){const t=Error(`0 width match regex (${e})`)
;throw t.languageName=e,t.badRule=w.rule,t}return 1}
if(w=o,"begin"===o.type)return(e=>{
const n=e[0],i=e.rule,s=new t(i),o=[i.__beforeBegin,i["on:begin"]]
;for(const t of o)if(t&&(t(e,s),s.isMatchIgnored))return b(n)
;return i.skip?R+=n:(i.excludeBegin&&(R+=n),
g(),i.returnBegin||i.excludeBegin||(R=n)),h(i,e),i.returnBegin?0:n.length})(o)
;if("illegal"===o.type&&!s){
const e=Error('Illegal lexeme "'+a+'" for mode "'+(N.scope||"<unnamed>")+'"')
;throw e.mode=N,e}if("end"===o.type){const e=m(o);if(e!==ee)return e}
if("illegal"===o.type&&""===a)return 1
;if(I>1e5&&I>3*o.index)throw Error("potential infinite loop, way more iterations than matches")
;return R+=a,a.length}const _=O(e)
;if(!_)throw W(a.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const v=V(_);let k="",N=o||v;const S={},M=new p.__emitter(p);(()=>{const e=[]
;for(let t=N;t!==_;t=t.parent)t.scope&&e.unshift(t.scope)
;e.forEach((e=>M.openNode(e)))})();let R="",j=0,A=0,I=0,T=!1;try{
if(_.__emitTokens)_.__emitTokens(n,M);else{for(N.matcher.considerAll();;){
I++,T?T=!1:N.matcher.considerAll(),N.matcher.lastIndex=A
;const e=N.matcher.exec(n);if(!e)break;const t=y(n.substring(A,e.index),e)
;A=e.index+t}y(n.substring(A))}return M.finalize(),k=M.toHTML(),{language:e,
value:k,relevance:j,illegal:!1,_emitter:M,_top:N}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:Y(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:A,
context:n.slice(A-100,A+100),mode:t.mode,resultSoFar:k},_emitter:M};if(r)return{
language:e,value:Y(n),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:N}
;throw t}}function x(e,t){t=t||p.languages||Object.keys(i);const n=(e=>{
const t={value:Y(e),illegal:!1,relevance:0,_top:l,_emitter:new p.__emitter(p)}
;return t._emitter.addText(e),t})(e),s=t.filter(O).filter(k).map((t=>E(t,e,!1)))
;s.unshift(n);const o=s.sort(((e,t)=>{
if(e.relevance!==t.relevance)return t.relevance-e.relevance
;if(e.language&&t.language){if(O(e.language).supersetOf===t.language)return 1
;if(O(t.language).supersetOf===e.language)return-1}return 0})),[r,a]=o,c=r
;return c.secondBest=a,c}function w(e){let t=null;const n=(e=>{
let t=e.className+" ";t+=e.parentNode?e.parentNode.className:""
;const n=p.languageDetectRe.exec(t);if(n){const t=O(n[1])
;return t||(X(a.replace("{}",n[1])),
X("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}
return t.split(/\s+/).find((e=>b(e)||O(e)))})(e);if(b(n))return
;if(N("before:highlightElement",{el:e,language:n
}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e)
;if(e.children.length>0&&(p.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),p.throwUnescapedHTML))throw new J("One of your code blocks includes unescaped HTML.",e.innerHTML)
;t=e;const i=t.textContent,o=n?m(i,{language:n,ignoreIllegals:!0}):x(i)
;e.innerHTML=o.value,e.dataset.highlighted="yes",((e,t,n)=>{const i=t&&s[t]||n
;e.classList.add("hljs"),e.classList.add("language-"+i)
})(e,n,o.language),e.result={language:o.language,re:o.relevance,
relevance:o.relevance},o.secondBest&&(e.secondBest={
language:o.secondBest.language,relevance:o.secondBest.relevance
}),N("after:highlightElement",{el:e,result:o,text:i})}let y=!1;function _(){
"loading"!==document.readyState?document.querySelectorAll(p.cssSelector).forEach(w):y=!0
}function O(e){return e=(e||"").toLowerCase(),i[e]||i[s[e]]}
function v(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{
s[e.toLowerCase()]=t}))}function k(e){const t=O(e)
;return t&&!t.disableAutodetect}function N(e,t){const n=e;o.forEach((e=>{
e[n]&&e[n](t)}))}
"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(()=>{
y&&_()}),!1),Object.assign(n,{highlight:m,highlightAuto:x,highlightAll:_,
highlightElement:w,
highlightBlock:e=>(G("10.7.0","highlightBlock will be removed entirely in v12.0"),
G("10.7.0","Please use highlightElement now."),w(e)),configure:e=>{p=Q(p,e)},
initHighlighting:()=>{
_(),G("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
_(),G("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(e,t)=>{let s=null;try{s=t(n)}catch(t){
if(W("Language definition for '{}' could not be registered.".replace("{}",e)),
!r)throw t;W(t),s=l}
s.name||(s.name=e),i[e]=s,s.rawDefinition=t.bind(null,n),s.aliases&&v(s.aliases,{
languageName:e})},unregisterLanguage:e=>{delete i[e]
;for(const t of Object.keys(s))s[t]===e&&delete s[t]},
listLanguages:()=>Object.keys(i),getLanguage:O,registerAliases:v,
autoDetection:k,inherit:Q,addPlugin:e=>{(e=>{
e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{
e["before:highlightBlock"](Object.assign({block:t.el},t))
}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{
e["after:highlightBlock"](Object.assign({block:t.el},t))})})(e),o.push(e)},
removePlugin:e=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}),n.debugMode=()=>{
r=!1},n.safeMode=()=>{r=!0},n.versionString="11.10.0",n.regex={concat:h,
lookahead:g,either:f,optional:d,anyNumberOfTimes:u}
;for(const t in j)"object"==typeof j[t]&&e(j[t]);return Object.assign(n,j),n
},ne=te({});return ne.newInstance=()=>te({}),ne}()
; true&&(module.exports=hljs);/*! `bash` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict";return e=>{const s=e.regex,t={},n={begin:/\$\{/,
end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{
className:"variable",variants:[{
begin:s.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},n]});const a={
className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]
},i=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),c={
begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,
end:/(\w+)/,className:"string"})]}},o={className:"string",begin:/"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,t,a]};a.contains.push(o);const r={begin:/\$?\(\(/,
end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]
},l=e.SHEBANG({binary:"(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",relevance:10
}),m={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,
contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0};return{
name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,
keyword:["if","then","else","elif","fi","for","while","until","in","do","done","case","esac","function","select"],
literal:["true","false"],
built_in:["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset","alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias","set","shopt","autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp","chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"]
},contains:[l,e.SHEBANG(),m,r,i,c,{match:/(\/[a-z._-]+)+/},o,{match:/\\"/},{
className:"string",begin:/'/,end:/'/},{match:/\\'/},t]}}})()
;hljs.registerLanguage("bash",e)})();/*! `css` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict"
;const e=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video","defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],r=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),t=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),i=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),o=["accent-color","align-content","align-items","align-self","alignment-baseline","all","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","appearance","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-end-end-radius","border-end-start-radius","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","cx","cy","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","content","content-visibility","counter-increment","counter-reset","cue","cue-after","cue-before","cursor","direction","display","dominant-baseline","empty-cells","enable-background","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flow","flood-color","flood-opacity","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-size","font-size-adjust","font-smoothing","font-stretch","font-style","font-synthesis","font-variant","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","inline-size","inset","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","kerning","justify-content","justify-items","justify-self","left","letter-spacing","lighting-color","line-break","line-height","list-style","list-style-image","list-style-position","list-style-type","marker","marker-end","marker-mid","marker-start","mask","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-wrap","overflow-x","overflow-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","pause","pause-after","pause-before","perspective","perspective-origin","pointer-events","position","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","scale","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","speak","speak-as","src","tab-size","table-layout","text-anchor","text-align","text-align-all","text-align-last","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-transform","text-underline-offset","text-underline-position","top","transform","transform-box","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","vector-effect","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index"].sort().reverse()
;return n=>{const a=n.regex,l=(e=>({IMPORTANT:{scope:"meta",begin:"!important"},
BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",
begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},FUNCTION_DISPATCH:{
className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{
scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{
scope:"number",
begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}
}))(n),s=[n.APOS_STRING_MODE,n.QUOTE_STRING_MODE];return{name:"CSS",
case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},
classNameAliases:{keyframePosition:"selector-tag"},contains:[l.BLOCK_COMMENT,{
begin:/-(webkit|moz|ms|o)-(?=[a-z])/},l.CSS_NUMBER_MODE,{
className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{
className:"selector-class",begin:"\\.[a-zA-Z-][a-zA-Z0-9_-]*",relevance:0
},l.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{
begin:":("+t.join("|")+")"},{begin:":(:)?("+i.join("|")+")"}]},l.CSS_VARIABLE,{
className:"attribute",begin:"\\b("+o.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,
contains:[l.BLOCK_COMMENT,l.HEXCOLOR,l.IMPORTANT,l.CSS_NUMBER_MODE,...s,{
begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"
},contains:[...s,{className:"string",begin:/[^)]/,endsWithParent:!0,
excludeEnd:!0}]},l.FUNCTION_DISPATCH]},{begin:a.lookahead(/@/),end:"[{;]",
relevance:0,illegal:/:/,contains:[{className:"keyword",begin:/@-?\w[\w]*(-\w+)*/
},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{
$pattern:/[a-z-]+/,keyword:"and or not only",attribute:r.join(" ")},contains:[{
begin:/[a-z-]+(?=:)/,className:"attribute"},...s,l.CSS_NUMBER_MODE]}]},{
className:"selector-tag",begin:"\\b("+e.join("|")+")\\b"}]}}})()
;hljs.registerLanguage("css",e)})();/*! `javascript` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict"
;const e="[A-Za-z$_][0-9A-Za-z$_]*",n=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],a=["true","false","null","undefined","NaN","Infinity"],t=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],s=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],r=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],c=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],i=[].concat(r,t,s)
;return o=>{const l=o.regex,b=e,d={begin:/<[A-Za-z0-9\\._:-]+/,
end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(e,n)=>{
const a=e[0].length+e.index,t=e.input[a]
;if("<"===t||","===t)return void n.ignoreMatch();let s
;">"===t&&(((e,{after:n})=>{const a="</"+e[0].slice(1)
;return-1!==e.input.indexOf(a,n)})(e,{after:a})||n.ignoreMatch())
;const r=e.input.substring(a)
;((s=r.match(/^\s*=/))||(s=r.match(/^\s+extends\s+/))&&0===s.index)&&n.ignoreMatch()
}},g={$pattern:e,keyword:n,literal:a,built_in:i,"variable.language":c
},u="[0-9](_?[0-9])*",m=`\\.(${u})`,E="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",A={
className:"number",variants:[{
begin:`(\\b(${E})((${m})|\\.)?|(${m}))[eE][+-]?(${u})\\b`},{
begin:`\\b(${E})\\b((${m})\\b|\\.)?|(${m})\\b`},{
begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{
begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{
begin:"\\b0[0-7]+n?\\b"}],relevance:0},y={className:"subst",begin:"\\$\\{",
end:"\\}",keywords:g,contains:[]},h={begin:".?html`",end:"",starts:{end:"`",
returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"xml"}},N={
begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,
contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"css"}},_={begin:".?gql`",end:"",
starts:{end:"`",returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],
subLanguage:"graphql"}},f={className:"string",begin:"`",end:"`",
contains:[o.BACKSLASH_ESCAPE,y]},p={className:"comment",
variants:[o.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{
begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,
excludeBegin:!0,relevance:0},{className:"variable",begin:b+"(?=\\s*(-)|$)",
endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]
}),o.C_BLOCK_COMMENT_MODE,o.C_LINE_COMMENT_MODE]
},v=[o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,h,N,_,f,{match:/\$\d+/},A]
;y.contains=v.concat({begin:/\{/,end:/\}/,keywords:g,contains:["self"].concat(v)
});const S=[].concat(p,y.contains),w=S.concat([{begin:/(\s*)\(/,end:/\)/,
keywords:g,contains:["self"].concat(S)}]),R={className:"params",begin:/(\s*)\(/,
end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w},O={variants:[{
match:[/class/,/\s+/,b,/\s+/,/extends/,/\s+/,l.concat(b,"(",l.concat(/\./,b),")*")],
scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{
match:[/class/,/\s+/,b],scope:{1:"keyword",3:"title.class"}}]},k={relevance:0,
match:l.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
className:"title.class",keywords:{_:[...t,...s]}},I={variants:[{
match:[/function/,/\s+/,b,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],
className:{1:"keyword",3:"title.function"},label:"func.def",contains:[R],
illegal:/%/},x={
match:l.concat(/\b/,(T=[...r,"super","import"].map((e=>e+"\\s*\\(")),
l.concat("(?!",T.join("|"),")")),b,l.lookahead(/\s*\(/)),
className:"title.function",relevance:0};var T;const C={
begin:l.concat(/\./,l.lookahead(l.concat(b,/(?![0-9A-Za-z$_(])/))),end:b,
excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},M={
match:[/get|set/,/\s+/,b,/(?=\()/],className:{1:"keyword",3:"title.function"},
contains:[{begin:/\(\)/},R]
},B="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+o.UNDERSCORE_IDENT_RE+")\\s*=>",$={
match:[/const|var|let/,/\s+/,b,/\s*/,/=\s*/,/(async\s*)?/,l.lookahead(B)],
keywords:"async",className:{1:"keyword",3:"title.function"},contains:[R]}
;return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:g,exports:{
PARAMS_CONTAINS:w,CLASS_REFERENCE:k},illegal:/#(?![$_A-z])/,
contains:[o.SHEBANG({label:"shebang",binary:"node",relevance:5}),{
label:"use_strict",className:"meta",relevance:10,
begin:/^\s*['"]use (strict|asm)['"]/
},o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,h,N,_,f,p,{match:/\$\d+/},A,k,{
className:"attr",begin:b+l.lookahead(":"),relevance:0},$,{
begin:"("+o.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",
keywords:"return throw case",relevance:0,contains:[p,o.REGEXP_MODE,{
className:"function",begin:B,returnBegin:!0,end:"\\s*=>",contains:[{
className:"params",variants:[{begin:o.UNDERSCORE_IDENT_RE,relevance:0},{
className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w}]}]},{begin:/,/,relevance:0
},{match:/\s+/,relevance:0},{variants:[{begin:"<>",end:"</>"},{
match:/<[A-Za-z0-9\\._:-]+\s*\/>/},{begin:d.begin,
"on:begin":d.isTrulyOpeningTag,end:d.end}],subLanguage:"xml",contains:[{
begin:d.begin,end:d.end,skip:!0,contains:["self"]}]}]},I,{
beginKeywords:"while if switch catch for"},{
begin:"\\b(?!function)"+o.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
returnBegin:!0,label:"func.def",contains:[R,o.inherit(o.TITLE_MODE,{begin:b,
className:"title.function"})]},{match:/\.\.\./,relevance:0},C,{match:"\\$"+b,
relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},
contains:[R]},x,{relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,
className:"variable.constant"},O,M,{match:/\$[(.]/}]}}})()
;hljs.registerLanguage("javascript",e)})();/*! `plaintext` grammar compiled for Highlight.js 11.10.0 */
(()=>{var t=(()=>{"use strict";return t=>({name:"Plain text",
aliases:["text","txt"],disableAutodetect:!0})})()
;hljs.registerLanguage("plaintext",t)})();/*! `python` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const n=e.regex,a=/[\p{XID_Start}_]\p{XID_Continue}*/u,s=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],t={
$pattern:/[A-Za-z]\w+|__\w+__/,keyword:s,
built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],
literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],
type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]
},i={className:"meta",begin:/^(>>>|\.\.\.) /},r={className:"subst",begin:/\{/,
end:/\}/,keywords:t,illegal:/#/},l={begin:/\{\{/,relevance:0},o={
className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,i],relevance:10},{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,
contains:[e.BACKSLASH_ESCAPE,i],relevance:10},{
begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,i,l,r]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,
end:/"""/,contains:[e.BACKSLASH_ESCAPE,i,l,r]},{begin:/([uU]|[rR])'/,end:/'/,
relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{
begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,
end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,
contains:[e.BACKSLASH_ESCAPE,l,r]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,l,r]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},b="[0-9](_?[0-9])*",c=`(\\b(${b}))?\\.(${b})|\\b(${b})\\.`,d="\\b|"+s.join("|"),g={
className:"number",relevance:0,variants:[{
begin:`(\\b(${b})|(${c}))[eE][+-]?(${b})[jJ]?(?=${d})`},{begin:`(${c})[jJ]?`},{
begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})`},{
begin:`\\b0[bB](_?[01])+[lL]?(?=${d})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${d})`
},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})`},{begin:`\\b(${b})[jJ](?=${d})`
}]},p={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:t,
contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},m={
className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,
end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:t,
contains:["self",i,g,o,e.HASH_COMMENT_MODE]}]};return r.contains=[o,g,i],{
name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:t,
illegal:/(<\/|\?)|=>/,contains:[i,g,{scope:"variable.language",match:/\bself\b/
},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"
},o,p,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,a],scope:{1:"keyword",
3:"title.function"},contains:[m]},{variants:[{
match:[/\bclass/,/\s+/,a,/\s*/,/\(\s*/,a,/\s*\)/]},{match:[/\bclass/,/\s+/,a]}],
scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{
className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[g,m,o]}]}}})()
;hljs.registerLanguage("python",e)})();/*! `shell` grammar compiled for Highlight.js 11.10.0 */
(()=>{var s=(()=>{"use strict";return s=>({name:"Shell Session",
aliases:["console","shellsession"],contains:[{className:"meta.prompt",
begin:/^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\](?=\s*$)/,
subLanguage:"bash"}}]})})();hljs.registerLanguage("shell",s)})();/*! `typescript` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict"
;const e="[A-Za-z$_][0-9A-Za-z$_]*",n=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],a=["true","false","null","undefined","NaN","Infinity"],t=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],s=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],r=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],c=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],i=[].concat(r,t,s)
;function o(o){const l=o.regex,d=e,b={begin:/<[A-Za-z0-9\\._:-]+/,
end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(e,n)=>{
const a=e[0].length+e.index,t=e.input[a]
;if("<"===t||","===t)return void n.ignoreMatch();let s
;">"===t&&(((e,{after:n})=>{const a="</"+e[0].slice(1)
;return-1!==e.input.indexOf(a,n)})(e,{after:a})||n.ignoreMatch())
;const r=e.input.substring(a)
;((s=r.match(/^\s*=/))||(s=r.match(/^\s+extends\s+/))&&0===s.index)&&n.ignoreMatch()
}},g={$pattern:e,keyword:n,literal:a,built_in:i,"variable.language":c
},u="[0-9](_?[0-9])*",m=`\\.(${u})`,E="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",A={
className:"number",variants:[{
begin:`(\\b(${E})((${m})|\\.)?|(${m}))[eE][+-]?(${u})\\b`},{
begin:`\\b(${E})\\b((${m})\\b|\\.)?|(${m})\\b`},{
begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{
begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{
begin:"\\b0[0-7]+n?\\b"}],relevance:0},y={className:"subst",begin:"\\$\\{",
end:"\\}",keywords:g,contains:[]},p={begin:".?html`",end:"",starts:{end:"`",
returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"xml"}},N={
begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,
contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"css"}},f={begin:".?gql`",end:"",
starts:{end:"`",returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],
subLanguage:"graphql"}},_={className:"string",begin:"`",end:"`",
contains:[o.BACKSLASH_ESCAPE,y]},h={className:"comment",
variants:[o.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{
begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,
excludeBegin:!0,relevance:0},{className:"variable",begin:d+"(?=\\s*(-)|$)",
endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]
}),o.C_BLOCK_COMMENT_MODE,o.C_LINE_COMMENT_MODE]
},S=[o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,p,N,f,_,{match:/\$\d+/},A]
;y.contains=S.concat({begin:/\{/,end:/\}/,keywords:g,contains:["self"].concat(S)
});const v=[].concat(h,y.contains),w=v.concat([{begin:/(\s*)\(/,end:/\)/,
keywords:g,contains:["self"].concat(v)}]),R={className:"params",begin:/(\s*)\(/,
end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w},k={variants:[{
match:[/class/,/\s+/,d,/\s+/,/extends/,/\s+/,l.concat(d,"(",l.concat(/\./,d),")*")],
scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{
match:[/class/,/\s+/,d],scope:{1:"keyword",3:"title.class"}}]},x={relevance:0,
match:l.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
className:"title.class",keywords:{_:[...t,...s]}},O={variants:[{
match:[/function/,/\s+/,d,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],
className:{1:"keyword",3:"title.function"},label:"func.def",contains:[R],
illegal:/%/},I={
match:l.concat(/\b/,(C=[...r,"super","import"].map((e=>e+"\\s*\\(")),
l.concat("(?!",C.join("|"),")")),d,l.lookahead(/\s*\(/)),
className:"title.function",relevance:0};var C;const T={
begin:l.concat(/\./,l.lookahead(l.concat(d,/(?![0-9A-Za-z$_(])/))),end:d,
excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},M={
match:[/get|set/,/\s+/,d,/(?=\()/],className:{1:"keyword",3:"title.function"},
contains:[{begin:/\(\)/},R]
},B="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+o.UNDERSCORE_IDENT_RE+")\\s*=>",$={
match:[/const|var|let/,/\s+/,d,/\s*/,/=\s*/,/(async\s*)?/,l.lookahead(B)],
keywords:"async",className:{1:"keyword",3:"title.function"},contains:[R]}
;return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:g,exports:{
PARAMS_CONTAINS:w,CLASS_REFERENCE:x},illegal:/#(?![$_A-z])/,
contains:[o.SHEBANG({label:"shebang",binary:"node",relevance:5}),{
label:"use_strict",className:"meta",relevance:10,
begin:/^\s*['"]use (strict|asm)['"]/
},o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,p,N,f,_,h,{match:/\$\d+/},A,x,{
className:"attr",begin:d+l.lookahead(":"),relevance:0},$,{
begin:"("+o.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",
keywords:"return throw case",relevance:0,contains:[h,o.REGEXP_MODE,{
className:"function",begin:B,returnBegin:!0,end:"\\s*=>",contains:[{
className:"params",variants:[{begin:o.UNDERSCORE_IDENT_RE,relevance:0},{
className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w}]}]},{begin:/,/,relevance:0
},{match:/\s+/,relevance:0},{variants:[{begin:"<>",end:"</>"},{
match:/<[A-Za-z0-9\\._:-]+\s*\/>/},{begin:b.begin,
"on:begin":b.isTrulyOpeningTag,end:b.end}],subLanguage:"xml",contains:[{
begin:b.begin,end:b.end,skip:!0,contains:["self"]}]}]},O,{
beginKeywords:"while if switch catch for"},{
begin:"\\b(?!function)"+o.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
returnBegin:!0,label:"func.def",contains:[R,o.inherit(o.TITLE_MODE,{begin:d,
className:"title.function"})]},{match:/\.\.\./,relevance:0},T,{match:"\\$"+d,
relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},
contains:[R]},I,{relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,
className:"variable.constant"},k,M,{match:/\$[(.]/}]}}return t=>{
const s=o(t),r=e,l=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],d={
begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}
},b={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{
keyword:"interface extends",built_in:l},contains:[s.exports.CLASS_REFERENCE]
},g={$pattern:e,
keyword:n.concat(["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"]),
literal:a,built_in:i.concat(l),"variable.language":c},u={className:"meta",
begin:"@"+r},m=(e,n,a)=>{const t=e.contains.findIndex((e=>e.label===n))
;if(-1===t)throw Error("can not find mode to replace");e.contains.splice(t,1,a)}
;Object.assign(s.keywords,g),s.exports.PARAMS_CONTAINS.push(u)
;const E=s.contains.find((e=>"attr"===e.className))
;return s.exports.PARAMS_CONTAINS.push([s.exports.CLASS_REFERENCE,E]),
s.contains=s.contains.concat([u,d,b]),
m(s,"shebang",t.SHEBANG()),m(s,"use_strict",{className:"meta",relevance:10,
begin:/^\s*['"]use strict['"]/
}),s.contains.find((e=>"func.def"===e.label)).relevance=0,Object.assign(s,{
name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),s}})()
;hljs.registerLanguage("typescript",e)})();/*! `xml` grammar compiled for Highlight.js 11.10.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const a=e.regex,n=a.concat(/[\p{L}_]/u,a.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s={
className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},t={begin:/\s/,
contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]
},i=e.inherit(t,{begin:/\(/,end:/\)/}),c=e.inherit(e.APOS_STRING_MODE,{
className:"string"}),l=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),r={
endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",
begin:/[\p{L}0-9._:-]+/u,relevance:0},{begin:/=\s*/,relevance:0,contains:[{
className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[s]},{
begin:/'/,end:/'/,contains:[s]},{begin:/[^\s"'=<>`]+/}]}]}]};return{
name:"HTML, XML",
aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],
case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,
end:/>/,relevance:10,contains:[t,l,c,i,{begin:/\[/,end:/\]/,contains:[{
className:"meta",begin:/<![a-z]/,end:/>/,contains:[t,i,l,c]}]}]
},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,
relevance:10},s,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,
relevance:10,contains:[l]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",
begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[r],starts:{
end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",
begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[r],starts:{
end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{
className:"tag",begin:/<>|<\/>/},{className:"tag",
begin:a.concat(/</,a.lookahead(a.concat(n,a.either(/\/>/,/>/,/\s/)))),
end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:r}]},{
className:"tag",begin:a.concat(/<\//,a.lookahead(a.concat(n,/>/))),contains:[{
className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}
})();hljs.registerLanguage("xml",e)})();

/***/ }),

/***/ "./V3/pages/fr/index.md":
/*!******************************!*\
  !*** ./V3/pages/fr/index.md ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "fr/index.html");

/***/ }),

/***/ "./V3/pages/fr/index.css":
/*!*******************************!*\
  !*** ./V3/pages/fr/index.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.css":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.css ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (":host {\n    display: block;\n\n    & > div {\n\n        width: 100%;\n        height: 100%;\n        font-family: monospace;\n\n        box-sizing: border-box;\n        padding: 12px;\n\n        /*border: 1px solid rgb(204, 204, 204);*/\n        border-radius: 3px;\n        background-color: light-dark(rgb(204, 204, 204), rgb(51, 51, 51) );\n\n        white-space: pre;\n        overflow-wrap: break-word;\n\n        /* ensures last line height even if empty */\n        &::after {\n            content: \"\\200b\"\n        }\n    }\n}");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.html":
/*!******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.html ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<div spellcheck=\"false\" contenteditable></div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/playground-area/PlaygroundArea.css":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/playground-area/PlaygroundArea.css ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (":host {\n    display: grid;\n    grid : 1fr 1fr 1fr / 1fr 1fr 1fr;\n    gap: 5px;\n\n    justify-items: center;\n\n    width: 100%;\n\n    & .card {\n        width: 100%;\n        display: flex;\n        flex-flow: column nowrap; \n    }\n\n    & .card > .header {\n        text-align: center;\n    }\n    & .card > code-block {\n        width: 100%;\n        height: 100%;\n    }\n    & .card > iframe {\n        border: 1px solid black;\n        border-radius: 5px;\n        width: 100%;\n        height: fit-content;\n        box-sizing: border-box;\n    }\n}");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/scripts/scripts.css":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/scripts/scripts.css ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (":host(.block) {\n    display: block;\n\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n\n    padding: 12px;\n\n    overflow-x: auto;\n\n    margin-bottom: 2px;\n}\n\n:host {\n\n    font-family: monospace;\n\n\n    /*border: 1px solid rgb(204, 204, 204);*/\n    border-radius: 3px;\n    background-color: light-dark(rgb(204, 204, 204), rgb(51, 51, 51) );\n\n    white-space: pre;\n    overflow-wrap: break-word;\n\n    /* ensures last line height even if empty */\n    &::after {\n        content: \"\\200b\"\n    }\n\n    & h {\n        white-space: nowrap;\n        background: light-dark(white, lightblue);\n        font-style: italic;\n        border: 1px dashed gray;\n        color: gray;\n        border-radius: 4px;\n\n        & var {\n            color: darkblue;\n            font-weight: bold;\n            font-style: normal;\n        }\n    }\n}");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/theme/Tomorrow.css":
/*!***********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/theme/Tomorrow.css ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("\n/* Tomorrow Theme */\n/* http://jmblog.github.com/color-themes-for-google-code-highlightjs */\n/* Original theme - https://github.com/chriskempson/tomorrow-theme */\n\n/* Tomorrow Comment */\n.hljs-comment,\n.hljs-quote {\n\tcolor: #8e908c;\n}\n\n/* Tomorrow Red */\n.hljs-variable,\n.hljs-template-variable,\n.hljs-tag,\n.hljs-name,\n.hljs-selector-id,\n.hljs-selector-class,\n.hljs-regexp,\n.hljs-deletion {\n\tcolor: #c82829;\n}\n\n/* Tomorrow Orange */\n.hljs-number,\n.hljs-built_in,\n.hljs-builtin-name,\n.hljs-literal,\n.hljs-type,\n.hljs-params,\n.hljs-meta,\n.hljs-link {\n\tcolor: #f5871f;\n}\n\n/* Tomorrow Yellow */\n.hljs-attribute {\n\tcolor: #eab700;\n}\n\n/* Tomorrow Green */\n.hljs-string,\n.hljs-symbol,\n.hljs-bullet,\n.hljs-addition {\n\tcolor: #718c00;\n}\n\n/* Tomorrow Blue */\n.hljs-title,\n.hljs-section {\n\tcolor: #4271ae;\n}\n\n/* Tomorrow Purple */\n.hljs-keyword,\n.hljs-selector-tag {\n\tcolor: #8959a8;\n}\n\n.hljs {\n\tdisplay: block;\n\toverflow-x: auto;\n\tcolor: #4d4d4c;\n\tpadding: 0.5em;\n}\n\n.hljs-emphasis {\n\tfont-style: italic;\n}\n\n.hljs-strong {\n\tfont-weight: bold;\n}");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./content.txt":
/*!***********************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./content.txt ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("+ V3:V3\n    - fr:🇫🇷\n        - getting-started:🚀 Prise en main\n        - conception:🕮 Concevoir un composant Web\n        - define:🕮 Créer un composant Web\n        - manipulate:🕮 Manipuler un composant Web\n        - content:🕮 Mettre à jour un composant Web (TODO)\n        - signals:🕮 Les signaux (TODO)\n    + en:🇬🇧\n    - playground:🧪 Playground\n    - https://github.com/denis-migdal/LISS:⭐ Github");

/***/ }),

/***/ "./V3/pages/fr/index.ts":
/*!******************************!*\
  !*** ./V3/pages/fr/index.ts ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pages_skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pages/skeleton */ "./V3/pages/skeleton/index.ts");
/* harmony import */ var pages_skeleton_components_liss_playground_LISSPlayground__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pages/skeleton/components/liss-playground/LISSPlayground */ "./V3/pages/skeleton/components/liss-playground/LISSPlayground.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pages_skeleton__WEBPACK_IMPORTED_MODULE_0__, pages_skeleton_components_liss_playground_LISSPlayground__WEBPACK_IMPORTED_MODULE_1__]);
([pages_skeleton__WEBPACK_IMPORTED_MODULE_0__, pages_skeleton_components_liss_playground_LISSPlayground__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/pages/skeleton/components/code-block/CodeBlock.ts":
/*!**************************************************************!*\
  !*** ./V3/pages/skeleton/components/code-block/CodeBlock.ts ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CodeBlock)
/* harmony export */ });
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var _hl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hl */ "./V3/pages/skeleton/components/hl.ts");
/* harmony import */ var _raw_loader_CodeBlock_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !!raw-loader!./CodeBlock.html */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.html");
/* harmony import */ var _raw_loader_CodeBlock_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !!raw-loader!./CodeBlock.css */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/code-block/CodeBlock.css");
/* harmony import */ var _raw_loader_pages_skeleton_components_theme_Tomorrow_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !!raw-loader!pages/skeleton/components/theme/Tomorrow.css */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/theme/Tomorrow.css");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_0__]);
src__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


// @ts-ignore

// @ts-ignore

// @ts-ignore

class CodeBlock extends (0,src__WEBPACK_IMPORTED_MODULE_0__["default"])({
    html: _raw_loader_CodeBlock_html__WEBPACK_IMPORTED_MODULE_2__["default"],
    css: [
        _raw_loader_CodeBlock_css__WEBPACK_IMPORTED_MODULE_3__["default"],
        _raw_loader_pages_skeleton_components_theme_Tomorrow_css__WEBPACK_IMPORTED_MODULE_4__["default"]
    ]
}) {
    #output = this.content.firstElementChild;
    #history_offset = 0;
    #history = new Array();
    constructor({ codeLang } = {}){
        super();
        if (codeLang !== undefined) this.host.setAttribute("code-lang", codeLang);
        this.#initOutput();
        this.update();
    }
    getCode() {
        return this.content.textContent;
    }
    setCode(code) {
        this.#history.length = 0;
        this.#history_offset = 0;
        this.#history.push({
            code,
            cursor: null
        });
        this.host.textContent = code;
        this.update();
    }
    #initOutput() {
        this.#history.push({
            code: this.host.textContent,
            cursor: (0,_hl__WEBPACK_IMPORTED_MODULE_1__.getCursorPos)(this.#output)
        });
        this.#output.addEventListener('paste', (ev)=>{
            ev.stopImmediatePropagation();
            ev.preventDefault();
            const copied = ev.clipboardData.getData('Text');
            const beg = (0,_hl__WEBPACK_IMPORTED_MODULE_1__.getCursorPos)(this.#output);
            const end = (0,_hl__WEBPACK_IMPORTED_MODULE_1__.getCursorEndPos)(this.#output);
            let code = this.#output.textContent;
            this.#output.textContent = code.slice(0, beg) + copied + code.slice(end);
            this.#output.dispatchEvent(new Event('input'));
            (0,_hl__WEBPACK_IMPORTED_MODULE_1__.setCursorPos)(this.#output, beg + copied.length);
        });
        this.#output.addEventListener("input", ()=>{
            const code = this.#output.textContent;
            this.host.textContent = code;
            // reset history offset
            this.#history.length -= this.#history_offset;
            this.#history_offset = 0;
            const cursor = (0,_hl__WEBPACK_IMPORTED_MODULE_1__.getCursorPos)(this.#output);
            this.update();
            (0,_hl__WEBPACK_IMPORTED_MODULE_1__.setCursorPos)(this.#output, cursor);
            this.#history.push({
                code,
                cursor
            });
        });
        // Tabulation key
        // @ts-ignore
        this.#output.addEventListener("keydown", (ev)=>{
            if (this.isRO) return;
            if (ev.ctrlKey === true) {
                const key = ev.key.toLowerCase();
                if (key === "z") {
                    ev.preventDefault();
                    if (!ev.shiftKey) {
                        if (this.#history_offset === this.#history.length - 1) return;
                        ++this.#history_offset;
                    } else {
                        if (this.#history_offset === 0) return;
                        --this.#history_offset;
                    }
                    let { code, cursor } = this.#history[this.#history.length - 1 - this.#history_offset];
                    this.host.textContent = code;
                    this.update();
                    if (cursor === null) cursor = code.length;
                    (0,_hl__WEBPACK_IMPORTED_MODULE_1__.setCursorPos)(this.#output, cursor);
                }
                return;
            }
            let char = null;
            if (ev.code === "Tab") char = "\t";
            if (ev.code === "Enter") char = "\n";
            if (char !== null) {
                ev.preventDefault();
                // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
                var doc = this.#output.ownerDocument.defaultView;
                var sel = doc.getSelection();
                var range = sel.getRangeAt(0);
                var tabNode = document.createTextNode(char);
                range.insertNode(tabNode);
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode);
                sel.removeAllRanges();
                sel.addRange(range);
                this.#output.dispatchEvent(new Event("input"));
            }
        });
    }
    get codeLang() {
        return this.host.getAttribute('code-lang') ?? "plaintext";
    }
    get isRO() {
        return this.host.hasAttribute('ro');
    }
    set isRO(ro) {
        this.host.toggleAttribute('ro', ro);
    }
    reset() {
        if (this.#history.length === 1) return;
        this.#history.length = 1;
        this.#history_offset = 0;
        // duplicated code...
        let { code, cursor } = this.#history[this.#history.length - 1 - this.#history_offset];
        this.host.textContent = code;
        this.update();
        if (cursor === null) cursor = code.length;
        (0,_hl__WEBPACK_IMPORTED_MODULE_1__.setCursorPos)(this.#output, cursor);
    }
    update(trigger_event = true) {
        this.#output.toggleAttribute("contenteditable", !this.isRO);
        this.#output.innerHTML = (0,_hl__WEBPACK_IMPORTED_MODULE_1__.hl)(this.host.textContent, this.codeLang);
        if (trigger_event) this.host.dispatchEvent(new Event('change'));
    }
    // TODO listen content.
    static observedAttributes = [
        "code-lang",
        "ro"
    ];
    attributeChangedCallback() {
        this.update(); //TODO: request update.
    }
}
src__WEBPACK_IMPORTED_MODULE_0__["default"].define('code-block', CodeBlock);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/pages/skeleton/components/code-switch/switch.ts":
/*!************************************************************!*\
  !*** ./V3/pages/skeleton/components/code-switch/switch.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const body = document.body;
const codes = body.getAttribute("code-langs")?.split(",");
if (codes !== undefined) {
    const url = new URL(location);
    let code = url.searchParams.get("code-lang") ?? localStorage.getItem("LISS.code-lang") ?? "js";
    const code_switch = document.createElement('span');
    code_switch.classList.add('code-lang_switch');
    body.setAttribute("code-lang", code);
    let pos = codes.indexOf(code);
    code_switch.addEventListener('click', ()=>{
        pos = ++pos % codes.length;
        code = codes[pos];
        const url = new URL(location);
        url.searchParams.set("code-lang", code);
        history.pushState({}, "", url);
        localStorage.setItem("LISS.code-lang", code);
        body.setAttribute("code-lang", code);
        body.dispatchEvent(new Event('code-lang_changed'));
    });
    body.append(code_switch);
}
// force module recognition to avoid "Cannot redeclare block-scoped variable" error.



/***/ }),

/***/ "./V3/pages/skeleton/components/color-switch/colors.ts":
/*!*************************************************************!*\
  !*** ./V3/pages/skeleton/components/color-switch/colors.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const root = document.documentElement;
root.classList.add(localStorage.getItem("LISS.color-scheme") ?? 'dark-mode');
const btn = document.createElement('span');
btn.classList.add('color-scheme-gui-btn');
btn.addEventListener('click', ()=>{
    const isDark = root.classList.toggle('dark-mode');
    root.classList.toggle('light-mode');
    localStorage.setItem("LISS.color-scheme", isDark ? 'dark-mode' : 'light-mode');
});
document.body.append(btn);
// force module recognition to avoid "Cannot redeclare block-scoped variable" error.



/***/ }),

/***/ "./V3/pages/skeleton/components/hl.ts":
/*!********************************************!*\
  !*** ./V3/pages/skeleton/components/hl.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCursorBegPos: () => (/* binding */ getCursorBegPos),
/* harmony export */   getCursorEndPos: () => (/* binding */ getCursorEndPos),
/* harmony export */   getCursorPos: () => (/* binding */ getCursorPos),
/* harmony export */   getCursorXPos: () => (/* binding */ getCursorXPos),
/* harmony export */   hl: () => (/* binding */ hl),
/* harmony export */   initContentEditableCode: () => (/* binding */ initContentEditableCode),
/* harmony export */   setCursorPos: () => (/* binding */ setCursorPos)
/* harmony export */ });
// const hljs = require('highlight.js');
const hljs = __webpack_require__(/*! ./highlight.min.js */ "./V3/pages/skeleton/components/highlight.min.js");
function hl(code, language) {
    return hljs.highlight(code, {
        language
    }).value;
}
function getCursorBegPos(target) {
    return getCursorXPos(target, "start");
}
function getCursorEndPos(target) {
    return getCursorXPos(target, "end");
}
function getCursorXPos(target, type) {
    if (target.getRootNode().activeElement !== target) return null;
    // Chromium/FF compatibility
    const root = target.getRootNode();
    // @ts-ignore
    let selection = root.getSelection?.();
    if (selection === undefined) selection = window.getSelection();
    let rrange = selection.getRangeAt(0);
    let path = [];
    let cur = rrange[`${type}Container`];
    while(cur !== target){
        path.push(cur);
        cur = cur.parentNode;
    }
    let cursor = 0;
    let children = target.childNodes;
    for(let i = path.length - 1; i >= 0; --i){
        for(let j = 0; j < children.length; ++j){
            if (children[j] === path[i]) break;
            cursor += children[j].textContent.length;
        }
        children = path[i].childNodes;
    }
    let offset = rrange[`${type}Offset`];
    // https://developer.mozilla.org/en-US/docs/Web/API/Range/startOffset
    if (rrange[`${type}Container`].nodeType === Node.TEXT_NODE) cursor += offset;
    else {
        for(let i = 0; i < offset; ++i)cursor += rrange[`${type}Container`].childNodes[i].textContent.length;
    }
    return cursor;
}
// https://stackoverflow.com/questions/21234741/place-caret-back-where-it-was-after-changing-innerhtml-of-a-contenteditable-elem
function getCursorPos(target) {
    return getCursorBegPos(target);
}
function setCursorPos(target, cursor) {
    if (cursor === null) return;
    let cur = target;
    while(cur.nodeType !== Node.TEXT_NODE){
        if (cur.childNodes.length === 0) break;
        for(let i = 0; i < cur.childNodes.length; ++i){
            const clen = cur.childNodes[i].textContent.length;
            if (cursor <= clen) {
                cur = cur.childNodes[i];
                break;
            }
            cursor -= clen;
        }
    }
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(cur, cursor);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
function initContentEditableCode(target) {
    const lang = target.getAttribute('lang') ?? "plaintext";
    target.setAttribute("spellcheck", "false");
    target.innerHTML = hl(target.textContent, lang);
    target.addEventListener("input", (ev)=>{
        const lang = target.getAttribute('lang') ?? "plaintext";
        const ev_target = ev.target;
        const cursor_pos = getCursorPos(ev_target);
        ev_target.innerHTML = hl(ev_target.textContent, lang);
        setCursorPos(ev_target, cursor_pos);
    });
    // Tabulation key
    // @ts-ignore
    target.addEventListener("keydown", (ev)=>{
        if (ev.code === "Tab") {
            ev.preventDefault();
            // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
            var doc = target.ownerDocument.defaultView;
            var sel = doc.getSelection();
            var range = sel.getRangeAt(0);
            var tabNode = document.createTextNode("\t");
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
}


/***/ }),

/***/ "./V3/pages/skeleton/components/liss-playground/LISSPlayground.ts":
/*!************************************************************************!*\
  !*** ./V3/pages/skeleton/components/liss-playground/LISSPlayground.ts ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var src_utils_tests_buildTestPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/utils/tests/buildTestPage */ "./V3/src/utils/tests/buildTestPage.ts");
/* harmony import */ var pages_skeleton_components_playground_area_PlaygroundArea__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pages/skeleton/components/playground-area/PlaygroundArea */ "./V3/pages/skeleton/components/playground-area/PlaygroundArea.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_0__, pages_skeleton_components_playground_area_PlaygroundArea__WEBPACK_IMPORTED_MODULE_2__]);
([src__WEBPACK_IMPORTED_MODULE_0__, pages_skeleton_components_playground_area_PlaygroundArea__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



class LISSPlayground extends pages_skeleton_components_playground_area_PlaygroundArea__WEBPACK_IMPORTED_MODULE_2__["default"] {
    generateIFrameContext() {
        const tagname = this.name;
        const cwd = `${location.origin}${this.klass.ASSETS_DIR}/${tagname}/`;
        let files = {};
        for (let ext of [
            "html",
            "css",
            "js"
        ])files[`${cwd}index.${ext}`] = this.codes[`index.${ext}`].getCode();
        return {
            override_tags: {
                [this.name.split(':')[0]]: this.name
            },
            fetch: {
                cwd,
                files
            }
        };
    }
    generateIFrameContent() {
        /*
        const brython = this.host.hasAttribute("brython");
        let p_js    = codes["page.js"   ];
        if( brython )
            p_js = `globalThis.__BRYTHON__.runPythonSource(\`${codes["page.bry"]}\`, "_");`;
        */ return (0,src_utils_tests_buildTestPage__WEBPACK_IMPORTED_MODULE_1__["default"])({
            liss: `/${src__WEBPACK_IMPORTED_MODULE_0__["default"].VERSION}/index.js`,
            cdir: `${this.klass.ASSETS_DIR}/`,
            js: this.codes["page.js"].getCode(),
            html: this.codes["page.html"].getCode(),
            tagname: this.name.split(':')[0]
        });
    }
    static RESSOURCES = [
        {
            title: 'WebComponent HTML',
            file: 'index.html'
        },
        {
            title: 'WebComponent JS',
            file: 'index.js'
        },
        {
            title: 'WebComponent Brython',
            file: 'index.bry'
        },
        {
            title: 'WebComponent CSS',
            file: 'index.css'
        },
        {
            title: 'WebPage HTML',
            file: 'page.html'
        },
        {
            title: 'WebPage JS',
            file: 'page.js'
        },
        {
            title: 'WebPage Brython',
            file: 'page.bry'
        }
    ];
}
src__WEBPACK_IMPORTED_MODULE_0__["default"].define('liss-playground', LISSPlayground);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/pages/skeleton/components/menu/menu.ts":
/*!***************************************************!*\
  !*** ./V3/pages/skeleton/components/menu/menu.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _raw_loader_content_txt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!raw-loader!../../../../../../content.txt */ "./node_modules/raw-loader/dist/cjs.js!./content.txt");
const body = document.body;
const menu_area = document.createElement('div');
const menu_pages = document.createElement('div');
const menu_page = document.createElement('div');
menu_page.classList.add('menu_page');
menu_pages.classList.add('menu_pages');
menu_area.classList.add('menu_area');
// Build page menu
// Update page menu
// Submenu
menu_area.append(menu_pages, menu_page);
body.prepend(menu_area);
// @ts-ignore

function buildPagesMenu(content) {
    const root = {
        dir: "/",
        text: "",
        href: "/",
        level: 1,
        parent: null,
        children: []
    };
    const current = new Array();
    current[1] = root;
    for (let item of content.split("\n")){
        const offset = item.search(/(\-|\+)/);
        const level = offset / 4 + 2;
        const sep = item.lastIndexOf(":");
        const target = item.slice(offset + 2, sep);
        const text = item.slice(sep + 1);
        const parent = current[level - 1];
        const isVirtual = item[offset] === "+";
        let dir = target;
        if (!target.startsWith('https://')) dir = parent.dir + target + "/";
        const href = isVirtual ? null : dir; // h4ck
        const node = {
            text,
            dir,
            href,
            level,
            parent,
            children: []
        };
        if (!isVirtual && parent.href === null) {
            let cur = parent;
            do {
                cur.href = node.href;
                cur = cur.parent;
            }while (cur.href === null)
        }
        parent.children.push(node);
        current[level] = node;
    }
    return root;
}
function buildPageMenu(parent = null) {
    const h1 = document.querySelector('h1');
    const root = {
        html: h1,
        href: `#${h1.id}`,
        text: getTitlePrefix(1, 1) + h1.textContent,
        level: 1,
        parent: null,
        children: []
    };
    let curpos = root;
    const titles = document.querySelectorAll("h2, h3, h4");
    for (let title of titles){
        const level = +title.tagName.slice(1);
        while(level <= curpos.level)curpos = curpos.parent;
        const elem = {
            html: title,
            href: `#${title.id}`,
            text: getTitlePrefix(level, curpos.children.length) + title.textContent,
            level,
            children: [],
            parent: curpos
        };
        curpos.children.push(elem);
        curpos = elem;
    }
    return root;
}
function searchCurPageHeader(htree, position) {
    const headers = htree.children;
    for(let i = headers.length - 1; i >= 0; --i){
        if (headers[i].html.offsetTop <= position + 2.5 * 14 + 5) return searchCurPageHeader(headers[i], position) ?? headers[i];
    }
    return null;
}
function searchCurPagesHeader(htree) {
    const curpage = window.location.pathname;
    let cur = htree;
    while(true){
        const find = cur.children.find((node)=>curpage.startsWith(node.dir));
        if (find === undefined) return cur;
        cur = find;
    }
}
const hid = [
    [],
    [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X"
    ],
    [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
    ],
    [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j"
    ]
];
function getTitlePrefix(level, idx) {
    if (level >= hid.length) return "";
    const num = hid[level][idx];
    return `${num}. `;
}
function buildMenu(nodes) {
    const menu = document.createElement("div");
    menu.classList.add("menu");
    menu.append(...nodes.map((s)=>{
        const item = document.createElement("a");
        item.textContent = s.text;
        item.setAttribute("href", s.href);
        return item;
    }));
    return menu;
}
function generateMenuHTML(target) {
    let headers = [];
    let cursor = target;
    while(cursor !== null){
        headers.push(cursor);
        cursor = cursor.parent;
    }
    const html = headers.reverse().map((hnode)=>{
        const h_html = document.createElement("span");
        const link = document.createElement("a");
        link.textContent = hnode.text;
        link.setAttribute('href', hnode.href);
        h_html.append(link);
        if (hnode.parent !== null) {
            const menu = buildMenu(hnode.parent.children);
            h_html.append(menu);
        }
        return h_html;
    });
    if (target.children.length !== 0) {
        const empty = document.createElement("span");
        empty.append(buildMenu(target.children));
        html.push(empty);
    }
    return html;
}
function updatePageMenu(menu) {
    //TODO: scale...
    const last = searchCurPageHeader(menu, document.documentElement.scrollTop);
    const html = generateMenuHTML(last ?? menu);
    menu_page.replaceChildren(...html);
}
const cur_page = searchCurPagesHeader(buildPagesMenu(_raw_loader_content_txt__WEBPACK_IMPORTED_MODULE_0__["default"]));
menu_pages.replaceChildren(...generateMenuHTML(cur_page));
const idx = cur_page.parent.children.indexOf(cur_page);
document.body.style.setProperty('counter-set', `h1 ${idx}`);
const hasH1 = document.body.querySelector("h1") !== null;
if (hasH1) {
    const menu = buildPageMenu();
    window.addEventListener('scroll', ()=>updatePageMenu(menu));
    updatePageMenu(menu);
}


/***/ }),

/***/ "./V3/pages/skeleton/components/page/page.ts":
/*!***************************************************!*\
  !*** ./V3/pages/skeleton/components/page/page.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const root_style = document.documentElement.style;
window.addEventListener('resize', ()=>{
    root_style.setProperty('--screen_width', `${window.innerWidth}`);
});
root_style.setProperty('--screen_width', `${window.innerWidth}`);
root_style.setProperty('--main-width', window.getComputedStyle(document.querySelector('main')).width.slice(0, -2));
// force module recognition to avoid "Cannot redeclare block-scoped variable" error.



/***/ }),

/***/ "./V3/pages/skeleton/components/playground-area/PlaygroundArea.ts":
/*!************************************************************************!*\
  !*** ./V3/pages/skeleton/components/playground-area/PlaygroundArea.ts ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaygroundArea)
/* harmony export */ });
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var _code_block_CodeBlock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../code-block/CodeBlock */ "./V3/pages/skeleton/components/code-block/CodeBlock.ts");
/* harmony import */ var src_utils_parsers_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/utils/parsers/html */ "./V3/src/utils/parsers/html.ts");
/* harmony import */ var src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/DOM/getPropertyInitialValue */ "./V3/src/utils/DOM/getPropertyInitialValue.ts");
/* harmony import */ var src_LISSClasses_LISSUpdate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/LISSClasses/LISSUpdate */ "./V3/src/LISSClasses/LISSUpdate.ts");
/* harmony import */ var src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/ContentGenerators/ContentGenerator */ "./V3/src/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var _raw_loader_PlaygroundArea_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!raw-loader!./PlaygroundArea.css */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/playground-area/PlaygroundArea.css");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_0__, _code_block_CodeBlock__WEBPACK_IMPORTED_MODULE_1__]);
([src__WEBPACK_IMPORTED_MODULE_0__, _code_block_CodeBlock__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






// @ts-ignore

class PlaygroundArea extends src_LISSClasses_LISSUpdate__WEBPACK_IMPORTED_MODULE_4__["default"] {
    static SHADOW_MODE = "open";
    static CONTENT_GENERATOR = new src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_5__["default"]({
        css: _raw_loader_PlaygroundArea_css__WEBPACK_IMPORTED_MODULE_6__["default"]
    });
    resources = {};
    codes = {};
    constructor(){
        super();
        const card2 = (0,src_utils_parsers_html__WEBPACK_IMPORTED_MODULE_2__["default"])`<div class="card"><div class="header"><strong>Result</strong></div></div>`;
        this.#iframe = document.createElement('iframe');
        card2.append(this.#iframe);
        this.resources['output'] = card2;
        for (let res of this.klass.RESSOURCES){
            let codeLang = res.file.slice(res.file.indexOf('.') + 1);
            if (codeLang === "bry") codeLang = "py";
            const code = this.codes[res.file] = new _code_block_CodeBlock__WEBPACK_IMPORTED_MODULE_1__["default"]({
                codeLang
            });
            const card = (0,src_utils_parsers_html__WEBPACK_IMPORTED_MODULE_2__["default"])`<div class="card"><div class="header"><strong>${res.title}</strong></div></div>`;
            card.append(code);
            this.resources[res.file] = card;
        }
        const lang = document.body.getAttribute("code-lang");
        this.#codeLang = lang ?? "js";
        this.#blocks = (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "blocks") ?? this.getAttribute('show')?.split(",") ?? null;
        document.body.addEventListener('code-lang_changed', ()=>{
            const lang = document.body.getAttribute("code-lang");
            this.codeLang = lang ?? "js";
        });
        // triggers
        this.name = (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "name") ?? this.getAttribute('name');
        // TODO: first content load...
        for(let code in this.codes)this.codes[code].addEventListener('change', ()=>this.requestUpdate());
    }
    requestUpdate() {
        super.requestUpdate();
    }
    #codeLang = "js";
    get codeLang() {
        return this.#codeLang;
    }
    set codeLang(codeLang) {
        if (codeLang === this.#codeLang) return;
        this.#codeLang = codeLang;
        this.updateLayout();
        this.requestUpdate();
    }
    #iframe;
    generateIFrameContent() {
        return "";
    }
    generateIFrameContext() {
        return {};
    }
    attributeChangedCallback(name, _, value) {
        if (name === "show") {
            this.blocks = value?.split(',') ?? null;
            return;
        }
        if (name === "name") {
            this.name = value;
            return;
        }
    }
    static observedAttributes = [
        "show",
        "name"
    ];
    static ASSETS_DIR = `/${src__WEBPACK_IMPORTED_MODULE_0__["default"].VERSION}/assets/`;
    static RESSOURCES = new Array();
    #name = null;
    files = {};
    onUpdate() {
        // required to properly reset the frame...
        // lose its state when moving in the DOM
        this.#iframe.replaceWith(this.#iframe);
        // this.#iframe.src = "about:config"
        const content = this.generateIFrameContent();
        const doc = this.#iframe.contentDocument;
        if (doc !== null) {
            /*doc.open();
            doc.write( content );
            doc.close();*/ this.#iframe.contentWindow.LISSContext = this.generateIFrameContext();
            this.#iframe.srcdoc = content;
        }
    }
    #blocks = null;
    set blocks(names) {
        this.#blocks = names;
        this.updateLayout();
    }
    get blocks() {
        return this.#blocks;
    }
    get klass() {
        return this.constructor;
    }
    get name() {
        return this.#name;
    }
    set name(name) {
        if (name === this.#name) return;
        this.#name = name;
        this.onNameChange();
    }
    async onNameChange() {
        if (this.#name !== null) this.files = await this.klass.loadComponentFiles(this.#name);
        else for (let res of this.klass.RESSOURCES)this.files[res.file] = "";
        this.updateLayout();
        this.fillBlocks();
    }
    fillBlocks() {
        for(let name in this.codes)this.codes[name].setCode(this.files[name]);
    }
    updateLayout() {
        const blocks = this.getBlocks();
        this.updateGridLayout(blocks);
        const output = this.resources["output"];
        const output_idx = blocks.indexOf("output");
        if (output_idx === -1 || !output.isConnected) return this.content.replaceChildren(...blocks.map((e)=>this.resources[e]));
        // do NOT move iframe, else state will be rested too soon.
        for (let child of [
            ...this.content.children
        ])if (child !== output) child.remove();
        for(let i = 0; i < output_idx; ++i)output.before(this.resources[blocks[i]]);
        for(let i = output_idx + 1; i < blocks.length; ++i)this.content.append(this.resources[blocks[i]]);
    }
    updateGridLayout(blocks) {
        if (blocks.length == 1) this.host.style.setProperty('grid', '1fr / 1fr');
        if (blocks.length >= 2 && blocks.length <= 4) this.host.style.setProperty('grid', 'auto / 1fr 1fr');
        if (blocks.length > 4) this.host.style.setProperty('grid', 'auto / 1fr 1fr 1fr');
    }
    getBlocks() {
        const lang = this.codeLang;
        const langs = this.klass.CodeLangs;
        let blocks = this.blocks;
        if (blocks === null) {
            blocks = Object.keys(this.files).filter((e)=>{
                const ext = e.slice(e.indexOf(".") + 1);
                return this.files[e] !== "" && (ext === lang || !langs.includes(ext));
            });
            blocks.push('output');
        } else blocks = blocks.map((e)=>e.endsWith('.code') ? e.slice(0, -4) + lang : e);
        return blocks;
    }
    static loadedComponentsFiles = {};
    static get CodeLangs() {
        return document.body.getAttribute("code-langs")?.split(",") ?? [];
    }
    static async loadComponentFiles(name) {
        let compos = this.loadedComponentsFiles[name];
        if (compos !== undefined) return compos;
        const compo_dir = this.ASSETS_DIR + name;
        let files = {};
        await Promise.all(this.RESSOURCES.map(async (ressource)=>{
            //TODO: remove 404 (sw.js)
            const resp = await fetch(`${compo_dir}/${ressource.file}`);
            let text = "";
            if (resp.ok) text = await resp.text();
            files[ressource.file] = text;
        }));
        return this.loadedComponentsFiles[name] = files;
    }
}
src__WEBPACK_IMPORTED_MODULE_0__["default"].define('playground-area', PlaygroundArea);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/pages/skeleton/components/scripts/scripts.ts":
/*!*********************************************************!*\
  !*** ./V3/pages/skeleton/components/scripts/scripts.ts ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scripts: () => (/* binding */ Scripts)
/* harmony export */ });
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var pages_skeleton_components_hl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pages/skeleton/components/hl */ "./V3/pages/skeleton/components/hl.ts");
/* harmony import */ var _raw_loader_scripts_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !!raw-loader!./scripts.css */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/scripts/scripts.css");
/* harmony import */ var _raw_loader_pages_skeleton_components_theme_Tomorrow_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !!raw-loader!pages/skeleton/components/theme/Tomorrow.css */ "./node_modules/raw-loader/dist/cjs.js!./V3/pages/skeleton/components/theme/Tomorrow.css");
/* harmony import */ var src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/DOM/whenDOMContentLoaded */ "./V3/src/utils/DOM/whenDOMContentLoaded.ts");
/* harmony import */ var src_utils_DOM_createElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/utils/DOM/createElement */ "./V3/src/utils/DOM/createElement.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_0__]);
src__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


// @ts-ignore

// @ts-ignore



class Scripts extends (0,src__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: [
        _raw_loader_scripts_css__WEBPACK_IMPORTED_MODULE_2__["default"],
        _raw_loader_pages_skeleton_components_theme_Tomorrow_css__WEBPACK_IMPORTED_MODULE_3__["default"]
    ]
}) {
    constructor(){
        super();
        let code = this.host.textContent;
        const lang = this.host.getAttribute("code-lang");
        if (code[0] === '\n') {
            this.host.classList.toggle("block", true);
            const offset = code.search(/[\S]/) - 1;
            const indent = code.slice(1, offset);
            code = code.replaceAll("\n" + indent, "\n");
            const end = code.lastIndexOf('\n');
            code = code.slice(1, end);
        }
        // TODO: get position then reinject ?
        const replaced = [];
        code = code.replaceAll(/\<h\>(.*?)\<\/h\>/g, (_, match)=>{
            replaced.push(match);
            return `__${replaced.length - 1}__`;
        });
        if (lang === "html") {
            code = code.replace("<xbody>", "</body>");
            code = code.replace("<xscript>", "</script>");
        }
        code = (0,pages_skeleton_components_hl__WEBPACK_IMPORTED_MODULE_1__.hl)(code, lang);
        code = code.replaceAll(/__([\d]*)__/g, (_, match)=>{
            let content = replaced[+match];
            content = content.replaceAll(/(\$[\w_]*)/g, (_, match)=>{
                return `<var>${match}</var>`;
            });
            return `<h>${content}</h>`;
        });
        this.content.innerHTML = code;
    }
}
src__WEBPACK_IMPORTED_MODULE_0__["default"].define("code-script", Scripts);
(0,src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])().then(()=>{
    for (let script of document.querySelectorAll('script[type^="c-"]')){
        const code = (0,src_utils_DOM_createElement__WEBPACK_IMPORTED_MODULE_5__["default"])("code-script");
        code.setAttribute("code-lang", script.getAttribute("type").slice(2));
        code.textContent = script.textContent;
        script.replaceWith(code);
    }
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/pages/skeleton/index.ts":
/*!************************************!*\
  !*** ./V3/pages/skeleton/index.ts ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_color_switch_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/color-switch/colors */ "./V3/pages/skeleton/components/color-switch/colors.ts");
/* harmony import */ var _components_page_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/page/page */ "./V3/pages/skeleton/components/page/page.ts");
/* harmony import */ var _components_code_switch_switch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/code-switch/switch */ "./V3/pages/skeleton/components/code-switch/switch.ts");
/* harmony import */ var _components_menu_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/menu/menu */ "./V3/pages/skeleton/components/menu/menu.ts");
/* harmony import */ var _components_scripts_scripts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/scripts/scripts */ "./V3/pages/skeleton/components/scripts/scripts.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_scripts_scripts__WEBPACK_IMPORTED_MODULE_4__]);
_components_scripts_scripts__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



// may be async ?

 //import "./code/code-block/CodeBlock";

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/src/ContentGenerators/AutoContentGenerator.ts":
/*!**********************************************************!*\
  !*** ./V3/src/ContentGenerators/AutoContentGenerator.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoContentGenerator)
/* harmony export */ });
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentGenerator */ "./V3/src/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var src_utils_encode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/utils/encode */ "./V3/src/utils/encode.ts");


const regex = /\$\{(.+?)\}/g;
class AutoContentGenerator extends _ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"] {
    prepareTemplate(html) {
        this.data = null;
        if (typeof html === 'string') {
            this.data = html;
            return;
        /*
            html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
                return `<liss value="${name}"></liss>`;
            });*/ //TODO: ${} in attr
        // - detect start ${ + end }
        // - register elem + attr name
        // - replace. 
        }
        super.prepareTemplate(html);
    }
    fillContent(shadow) {
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if (this.data !== null) {
            const str = this.data.replace(regex, (_, match)=>{
                const value = shadow.host.getAttribute(match);
                if (value === null) return '';
                return (0,src_utils_encode__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
            });
            super.prepareTemplate(str);
        }
        super.fillContent(shadow);
    /*
        // html magic values could be optimized...
        const values = content.querySelectorAll('liss[value]');
        for(let value of values)
            value.textContent = host.getAttribute(value.getAttribute('value')!)
        */ }
}


/***/ }),

/***/ "./V3/src/ContentGenerators/ContentGenerator.ts":
/*!******************************************************!*\
  !*** ./V3/src/ContentGenerators/ContentGenerator.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentGenerator)
/* harmony export */ });
/* harmony import */ var src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/utils/network/ressource */ "./V3/src/utils/network/ressource.ts");
/* harmony import */ var src_utils_parsers_template__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/utils/parsers/template */ "./V3/src/utils/parsers/template.ts");
/* harmony import */ var src_utils_parsers_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/utils/parsers/style */ "./V3/src/utils/parsers/style.ts");
/* harmony import */ var src_utils_DOM_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/DOM/isDOMContentLoaded */ "./V3/src/utils/DOM/isDOMContentLoaded.ts");
/* harmony import */ var src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/DOM/whenDOMContentLoaded */ "./V3/src/utils/DOM/whenDOMContentLoaded.ts");





const sharedCSS = new CSSStyleSheet();
//const sharedCSS = getSharedCSS(); // from LISSHost...
class ContentGenerator {
    data;
    constructor({ html, css = [] } = {}){
        const isReady = (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(html) && (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(css) && (0,src_utils_DOM_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_3__["default"])();
        if (isReady) this.prepare(html, css);
        const whenReady = Promise.all([
            (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(html),
            (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(css),
            (0,src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])()
        ]);
        whenReady.then((args)=>this.prepare(args[0], args[1]));
        this.isReady = isReady;
        this.whenReady = whenReady;
    }
    /** ready ***/ whenReady;
    isReady = false;
    /** process ressources **/ stylesheets = [];
    template = null;
    prepare(html, css) {
        if (html !== undefined) this.prepareTemplate(html);
        if (css !== undefined) this.prepareStyle(css);
    }
    prepareTemplate(html) {
        this.template = (0,src_utils_parsers_template__WEBPACK_IMPORTED_MODULE_1__["default"])(html);
    }
    prepareStyle(css) {
        if (!Array.isArray(css)) css = [
            css
        ];
        this.stylesheets = css.map((e)=>(0,src_utils_parsers_style__WEBPACK_IMPORTED_MODULE_2__["default"])(e));
    }
    /*** Generate contents ***/ initContent(target, mode) {
        let content = target;
        if (mode !== null) {
            content = target.attachShadow({
                mode
            });
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        //TODO: CSS for no shadow ???
        this.fillContent(content);
        return content;
    }
    fillContent(target) {
        if (this.template !== null) target.replaceChildren(this.createContent());
        //TODO...
        customElements.upgrade(target);
    }
    createContent() {
        return this.template.cloneNode(true);
    }
}


/***/ }),

/***/ "./V3/src/LISS.ts":
/*!************************!*\
  !*** ./V3/src/LISS.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/ContentGenerators/ContentGenerator */ "./V3/src/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var src_LISSClasses_LISSFull__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISSClasses/LISSFull */ "./V3/src/LISSClasses/LISSFull.ts");


//  builder
function LISS(opts = {}) {
    const content_generator = opts.content_generator ?? src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"];
    // @ts-ignore
    const generator = new content_generator(opts);
    return class _LISS extends src_LISSClasses_LISSFull__WEBPACK_IMPORTED_MODULE_1__["default"] {
        // TODO: no content if... ???
        // override attachShadow  ???
        static SHADOW_MODE = "open";
        static CONTENT_GENERATOR = generator;
    };
}
// used for plugins.
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);


/***/ }),

/***/ "./V3/src/LISSClasses/LISSBase.ts":
/*!****************************************!*\
  !*** ./V3/src/LISSClasses/LISSBase.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSBase)
/* harmony export */ });
class LISSBase extends HTMLElement {
    static SHADOW_MODE = null;
    // TODO: static cache getter + use static HTML/CSS.
    static CONTENT_GENERATOR = null;
    content = this;
    host = this;
    controler = this;
    constructor(){
        super();
        const klass = this.constructor;
        if (klass.CONTENT_GENERATOR !== null) this.content = klass.CONTENT_GENERATOR.initContent(this, klass.SHADOW_MODE);
    }
    // define for auto-complete.
    static observedAttributes = [];
    attributeChangedCallback(name, oldval, newval) {}
}


/***/ }),

/***/ "./V3/src/LISSClasses/LISSFull.ts":
/*!****************************************!*\
  !*** ./V3/src/LISSClasses/LISSFull.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _LISSSignal_ts__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _LISSSignal_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSSignal.ts */ "./V3/src/LISSClasses/LISSSignal.ts");



/***/ }),

/***/ "./V3/src/LISSClasses/LISSSignal.ts":
/*!******************************************!*\
  !*** ./V3/src/LISSClasses/LISSSignal.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSSignal)
/* harmony export */ });
/* harmony import */ var src_signals_Signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/signals/Signal */ "./V3/src/signals/Signal.ts");
/* harmony import */ var _LISSUpdate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSUpdate */ "./V3/src/LISSClasses/LISSUpdate.ts");
/* harmony import */ var src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/utils/DOM/getPropertyInitialValue */ "./V3/src/utils/DOM/getPropertyInitialValue.ts");



//TODO: getter ?
class LISSSignal extends _LISSUpdate__WEBPACK_IMPORTED_MODULE_1__["default"] {
    #signal = new src_signals_Signal__WEBPACK_IMPORTED_MODULE_0__.Signal();
    #callback = ()=>this.requestUpdate();
    constructor(value = null, signal = null){
        super();
        value ??= (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "value", null);
        signal ??= (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "source", null);
        if (value !== null) this.#signal.value = value;
        if (signal !== null) this.#signal.source = signal;
        this.#signal.listen(this.#callback);
    }
    set source(source) {
        this.#signal.source = source;
    }
    set value(value) {
        this.#signal.value = value;
    }
}


/***/ }),

/***/ "./V3/src/LISSClasses/LISSUpdate.ts":
/*!******************************************!*\
  !*** ./V3/src/LISSClasses/LISSUpdate.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSUpdate)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./V3/src/LISSClasses/LISSBase.ts");

class LISSUpdate extends _LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(){
        super();
        observer.observe(this);
    }
    #requestID = null;
    #updateRequested = false;
    #isVisible = false;
    static processIntersectionObserver(entries) {
        for(let i = 0; i < entries.length; ++i){
            const target = entries[i].target;
            const isVisible = entries[i].isIntersecting;
            target.#isVisible = isVisible;
            if (!isVisible && target.#requestID !== null) cancelAnimationFrame(target.#requestID);
            if (isVisible && target.#updateRequested && target.#requestID === null) target.#scheduleUpdate();
        }
    }
    #scheduleUpdate() {
        this.#requestID = requestAnimationFrame(()=>{
            this.#requestID = null;
            this.#updateRequested = false;
            this.onUpdate();
        });
    }
    requestUpdate() {
        if (this.#updateRequested) return;
        this.#updateRequested = true;
        if (!this.#isVisible) return;
        this.#scheduleUpdate();
    }
    onUpdate() {}
}
const observer = new IntersectionObserver(LISSUpdate.processIntersectionObserver);


/***/ }),

/***/ "./V3/src/define/autoload.ts":
/*!***********************************!*\
  !*** ./V3/src/define/autoload.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CDIR: () => (/* binding */ DEFAULT_CDIR),
/* harmony export */   LISS_MODE: () => (/* binding */ LISS_MODE),
/* harmony export */   autoload: () => (/* binding */ autoload),
/* harmony export */   loadComponent: () => (/* binding */ loadComponent)
/* harmony export */ });
/* harmony import */ var src_define_define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/define/define */ "./V3/src/define/define.ts");
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var src_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/ContentGenerators/AutoContentGenerator */ "./V3/src/ContentGenerators/AutoContentGenerator.ts");
/* harmony import */ var src_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/DOM/isPageLoaded */ "./V3/src/utils/DOM/isPageLoaded.ts");
/* harmony import */ var src_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/DOM/whenPageLoaded */ "./V3/src/utils/DOM/whenPageLoaded.ts");
/* harmony import */ var src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/utils/network/fetchText */ "./V3/src/utils/network/fetchText.ts");
/* harmony import */ var src_utils_execute__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/utils/execute */ "./V3/src/utils/execute/index.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_1__]);
src__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







const script = document.querySelector('script:is([liss-auto],[liss-cdir],[liss-sw])');
const LISS_MODE = script?.getAttribute('liss-mode') ?? null;
const DEFAULT_CDIR = script?.getAttribute('liss-cdir') ?? null;
// TODO: default ?
const SW_PATH = script?.getAttribute('liss-sw') ?? null;
if (LISS_MODE === "auto-load" && DEFAULT_CDIR !== null) {
    if (!(0,src_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__["default"])()) await (0,src_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])();
    autoload(DEFAULT_CDIR);
}
function autoload(cdir) {
    const SW = new Promise(async (resolve)=>{
        if (SW_PATH === null) {
            console.warn("You are using LISS Auto mode without sw.js.");
            resolve();
            return;
        }
        try {
            await navigator.serviceWorker.register(SW_PATH, {
                scope: "/"
            });
        } catch (e) {
            console.warn("Registration of ServiceWorker failed");
            console.error(e);
            resolve();
        }
        if (navigator.serviceWorker.controller) {
            resolve();
            return;
        }
        navigator.serviceWorker.addEventListener('controllerchange', ()=>{
            resolve();
        });
    });
    if (cdir[cdir.length - 1] !== '/') cdir += '/';
    //const brython = script.getAttribute("brython");
    // observe for new injected tags.
    new MutationObserver((mutations)=>{
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition.constructor.name === "HTMLElement") // cf https://github.com/WICG/webcomponents/issues/1097#issuecomment-2665092315
        // if(addition instanceof HTMLUnknownElement)
        addTag(addition);
    }).observe(document, {
        childList: true,
        subtree: true
    });
    for (let elem of document.querySelectorAll(":not(:defined)"))addTag(elem);
    async function addTag(tag) {
        await SW; // ensure SW is installed.
        const tagname = tag.tagName.toLowerCase();
        if (src_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.has(tagname) || customElements.get(tagname) !== undefined) return;
        loadComponent(tagname, {
            //brython,
            cdir
        });
    }
}
async function loadComponent(tagname, { cdir = DEFAULT_CDIR } = {}) {
    src_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.add(tagname);
    let true_tagdir = LISSContext?.override_tags?.[tagname] ?? tagname;
    const compo_dir = `${cdir}${true_tagdir}/`;
    const files = {};
    // strats : JS -> Bry -> HTML+CSS (cf script attr).
    files["js"] = await (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.js`, true);
    if (files["js"] === undefined) {
        // try/catch ?
        const promises = [
            (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.html`, true),
            (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.css`, true)
        ];
        [files["html"], files["css"]] = await Promise.all(promises);
    }
    return await defineWebComponent(tagname, files, compo_dir);
}
//TODO: rename from files ?
async function defineWebComponent(tagname, files, origin) {
    let klass;
    if ("js" in files) klass = (await (0,src_utils_execute__WEBPACK_IMPORTED_MODULE_6__["default"])(files["js"], "js", origin)).default;
    if (klass === undefined) klass = (0,src__WEBPACK_IMPORTED_MODULE_1__["default"])({
        content_generator: src_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"],
        ...files
    });
    (0,src_define_define__WEBPACK_IMPORTED_MODULE_0__["default"])(tagname, klass);
    return klass;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./V3/src/define/define.ts":
/*!*********************************!*\
  !*** ./V3/src/define/define.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WaitingDefine: () => (/* binding */ WaitingDefine),
/* harmony export */   "default": () => (/* binding */ define)
/* harmony export */ });
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");

const WaitingDefine = new Set();
async function define(tagname, Klass) {
    //TODO: Python class...
    //TODO: type safe
    if ("CONTENT_GENERATOR" in Klass) {
        const generator = Klass.CONTENT_GENERATOR;
        if (!generator.isReady) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
        }
    }
    WaitingDefine.delete(tagname);
    customElements.define(tagname, Klass);
    const p = _whenDefined__WEBPACK_IMPORTED_MODULE_0__._whenDefinedPromises.get(Klass);
    if (p !== undefined) p.resolve();
}

src_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].define = define;


/***/ }),

/***/ "./V3/src/define/index.ts":
/*!********************************!*\
  !*** ./V3/src/define/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* reexport safe */ _define__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   isDefined: () => (/* reexport safe */ _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   whenDefined: () => (/* reexport safe */ _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./define */ "./V3/src/define/define.ts");
/* harmony import */ var _isDefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isDefined */ "./V3/src/define/isDefined.ts");
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");




src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].define = _define__WEBPACK_IMPORTED_MODULE_0__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].isDefined = _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].whenDefined = _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"];



/***/ }),

/***/ "./V3/src/define/isDefined.ts":
/*!************************************!*\
  !*** ./V3/src/define/isDefined.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isDefined)
/* harmony export */ });
function isDefined(elem) {
    if (typeof elem === "string") return customElements.get(elem) !== undefined;
    return customElements.getName(elem) !== null;
}


/***/ }),

/***/ "./V3/src/define/whenDefined.ts":
/*!**************************************!*\
  !*** ./V3/src/define/whenDefined.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _whenDefinedPromises: () => (/* binding */ _whenDefinedPromises),
/* harmony export */   "default": () => (/* binding */ whenDefined)
/* harmony export */ });
const _whenDefinedPromises = new WeakMap();
async function whenDefined(elem) {
    if (typeof elem === "string") return await customElements.whenDefined(elem);
    if (customElements.getName(elem) !== null) return elem;
    let p = _whenDefinedPromises.get(elem);
    if (p === undefined) {
        p = Promise.withResolvers();
        _whenDefinedPromises.set(elem, p);
    }
    await p.promise;
    return elem;
}


/***/ }),

/***/ "./V3/src/index.ts":
/*!*************************!*\
  !*** ./V3/src/index.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");
/* harmony import */ var src_define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/define */ "./V3/src/define/index.ts");
/* harmony import */ var src_define_autoload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/define/autoload */ "./V3/src/define/autoload.ts");
/* harmony import */ var src_utils_parsers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/parsers */ "./V3/src/utils/parsers/index.ts");
/* harmony import */ var src_utils_network_require__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/network/require */ "./V3/src/utils/network/require.ts");
/* harmony import */ var src_utils_tests_assertElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/utils/tests/assertElement */ "./V3/src/utils/tests/assertElement.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_define_autoload__WEBPACK_IMPORTED_MODULE_2__]);
src_define_autoload__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].VERSION = "V3";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @ts-ignore
globalThis.LISS = src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"];

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/src/signals/IndirectSignal.ts":
/*!******************************************!*\
  !*** ./V3/src/signals/IndirectSignal.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IndirectSignal)
/* harmony export */ });
/* harmony import */ var _ROSignal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ROSignal */ "./V3/src/signals/ROSignal.ts");

class IndirectSignal extends _ROSignal__WEBPACK_IMPORTED_MODULE_0__["default"] {
    #source = null;
    _valueRead = false;
    constructor(source = null){
        super();
        this.#source = source;
        this.#source?.listen(this._callback);
    }
    trigger() {
        // no needs to trigger if previous value wasn't read.
        if (!this._valueRead) return this;
        this._valueRead = false;
        super.trigger();
        return this;
    }
    _callback = ()=>this.trigger();
    get source() {
        return this.#source;
    }
    set source(source) {
        if (this.#source === source) return;
        if (this.#source !== null) this.#source.unlisten(this._callback);
        this.#source = source;
        if (this.#source !== null) this.#source.listen(this._callback);
        else this._callback();
    }
    ack() {
        this._valueRead = true;
    }
    get value() {
        this.ack();
        if (this.#source === null) return null;
        return this.#source.value;
    }
}


/***/ }),

/***/ "./V3/src/signals/ROSignal.ts":
/*!************************************!*\
  !*** ./V3/src/signals/ROSignal.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ROSignal)
/* harmony export */ });
/* harmony import */ var _SignalEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignalEvent */ "./V3/src/signals/SignalEvent.ts");

class ROSignal extends _SignalEvent__WEBPACK_IMPORTED_MODULE_0__["default"] {
    listen(callback) {
        super.listen(callback);
        callback(this); // initial callback (when signal Data)
        return this;
    }
}


/***/ }),

/***/ "./V3/src/signals/Signal.ts":
/*!**********************************!*\
  !*** ./V3/src/signals/Signal.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Signal: () => (/* binding */ Signal)
/* harmony export */ });
/* harmony import */ var _IndirectSignal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IndirectSignal */ "./V3/src/signals/IndirectSignal.ts");

class Signal extends _IndirectSignal__WEBPACK_IMPORTED_MODULE_0__["default"] {
    _value = null;
    constructor(value = null, source = null){
        super(source);
        this._value = value;
    }
    set source(source) {
        if (source !== null) this._value = null;
        super.source = source; // may trigger if source change
    }
    get value() {
        if (this.source !== null) return super.value;
        this.ack();
        return this._value;
    }
    set value(value) {
        const oldValue = this._value;
        this._value = value;
        if (this.source !== null) {
            this.source = null; // will trigger
            return;
        }
        // trigger only if value changed
        if (value !== oldValue) this.trigger();
        return;
    }
}


/***/ }),

/***/ "./V3/src/signals/SignalEvent.ts":
/*!***************************************!*\
  !*** ./V3/src/signals/SignalEvent.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SignalEvent)
/* harmony export */ });
class SignalEvent {
    #callbacks = new Set();
    listen(callback) {
        this.#callbacks.add(callback);
        return this;
    }
    unlisten(callback) {
        this.#callbacks.delete(callback);
        return this;
    }
    trigger() {
        for (let callback of this.#callbacks)callback(this);
        return this;
    }
}


/***/ }),

/***/ "./V3/src/utils/DOM/createElement.ts":
/*!*******************************************!*\
  !*** ./V3/src/utils/DOM/createElement.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createElement)
/* harmony export */ });
const doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
function createElement(tagname) {
    return doc.createElement(tagname);
// return html(`<${tagname}/>`);
}


/***/ }),

/***/ "./V3/src/utils/DOM/getPropertyInitialValue.ts":
/*!*****************************************************!*\
  !*** ./V3/src/utils/DOM/getPropertyInitialValue.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPropertyInitialValue)
/* harmony export */ });
function getPropertyInitialValue(e, name, defaultValue) {
    if (!Object.hasOwn(e, name)) return defaultValue;
    const _ = e[name];
    delete e[name];
    return _;
}


/***/ }),

/***/ "./V3/src/utils/DOM/isDOMContentLoaded.ts":
/*!************************************************!*\
  !*** ./V3/src/utils/DOM/isDOMContentLoaded.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isDOMContentLoaded)
/* harmony export */ });
function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}


/***/ }),

/***/ "./V3/src/utils/DOM/isPageLoaded.ts":
/*!******************************************!*\
  !*** ./V3/src/utils/DOM/isPageLoaded.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPageLoaded)
/* harmony export */ });
function isPageLoaded() {
    return document.readyState === "complete";
}


/***/ }),

/***/ "./V3/src/utils/DOM/whenDOMContentLoaded.ts":
/*!**************************************************!*\
  !*** ./V3/src/utils/DOM/whenDOMContentLoaded.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
/* harmony import */ var _isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isDOMContentLoaded */ "./V3/src/utils/DOM/isDOMContentLoaded.ts");

async function whenDOMContentLoaded() {
    if ((0,_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_0__["default"])()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('DOMContentLoaded', ()=>{
        resolve();
    }, true);
    await promise;
}


/***/ }),

/***/ "./V3/src/utils/DOM/whenPageLoaded.ts":
/*!********************************************!*\
  !*** ./V3/src/utils/DOM/whenPageLoaded.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
/* harmony import */ var _isPageLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isPageLoaded */ "./V3/src/utils/DOM/isPageLoaded.ts");

async function whenDOMContentLoaded() {
    if ((0,_isPageLoaded__WEBPACK_IMPORTED_MODULE_0__["default"])()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('load', resolve, true);
    await promise;
}


/***/ }),

/***/ "./V3/src/utils/encode.ts":
/*!********************************!*\
  !*** ./V3/src/utils/encode.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ encodeHTML)
/* harmony export */ });
const converter = document.createElement('span');
function encodeHTML(text) {
    converter.textContent = text;
    return converter.innerHTML;
}


/***/ }),

/***/ "./V3/src/utils/execute/index.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/execute/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ execute)
/* harmony export */ });
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js */ "./V3/src/utils/execute/js.ts");

async function execute(code, type, origin) {
    if (type === "js") return await (0,_js__WEBPACK_IMPORTED_MODULE_0__["default"])(code, origin);
    throw new Error('');
}


/***/ }),

/***/ "./V3/src/utils/execute/js.ts":
/*!************************************!*\
  !*** ./V3/src/utils/execute/js.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ executeJS)
/* harmony export */ });
async function executeJS(code, origin) {
    const file = new Blob([
        code
    ], {
        type: 'application/javascript'
    });
    const url = URL.createObjectURL(file);
    const id = url.slice(url.lastIndexOf('/') + 1);
    ((globalThis.LISSContext ??= {}).execute ??= {
        url_map: {}
    }).url_map[id] = origin;
    const result = await import(/* webpackIgnore: true */ url);
    URL.revokeObjectURL(url);
    return result;
}


/***/ }),

/***/ "./V3/src/utils/network/fetchText.ts":
/*!*******************************************!*\
  !*** ./V3/src/utils/network/fetchText.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ fetchText)
/* harmony export */ });
// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
async function fetchText(uri, hide404 = false) {
    const fetchContext = globalThis.LISSContext?.fetch;
    if (fetchContext !== undefined) {
        const path = new URL(uri, fetchContext.cwd);
        const value = fetchContext.files[path.toString()];
        if (value === "") return undefined;
        if (value !== undefined) return value;
    }
    const options = hide404 ? {
        headers: {
            "liss-auto": "true"
        }
    } : {};
    const response = await fetch(uri, options);
    if (response.status !== 200) return undefined;
    if (hide404 && response.headers.get("status") === "404") return undefined;
    const answer = await response.text();
    if (answer === "") return undefined;
    return answer;
}


/***/ }),

/***/ "./V3/src/utils/network/require.ts":
/*!*****************************************!*\
  !*** ./V3/src/utils/network/require.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fetchText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetchText */ "./V3/src/utils/network/fetchText.ts");

// @ts-ignore
globalThis.require = async function(url) {
    const stack = new Error().stack;
    let caller;
    if (stack.startsWith("Error")) {
        caller = stack.split('\n')[1 + 1].slice(7);
    } else {
        caller = stack.split('\n')[1].slice(1);
    }
    if (caller.startsWith('blob:')) {
        caller = caller.slice(caller.lastIndexOf('/') + 1);
        caller = caller.slice(0, caller.indexOf(':'));
        url = LISSContext.execute.url_map[caller] + url;
    //TODO: rewrite URL...
    } else {
        console.warn(caller);
        throw new Error("require from non-blob import, unimplemented");
    }
    // TODO: reverify playground
    return await (0,_fetchText__WEBPACK_IMPORTED_MODULE_0__["default"])(url);
};


/***/ }),

/***/ "./V3/src/utils/network/ressource.ts":
/*!*******************************************!*\
  !*** ./V3/src/utils/network/ressource.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRessourceReady: () => (/* binding */ isRessourceReady),
/* harmony export */   waitRessource: () => (/* binding */ waitRessource)
/* harmony export */ });
function isRessourceReady(res) {
    if (Array.isArray(res)) return res.every((e)=>isRessourceReady(e));
    return res === undefined || !(res instanceof Promise || res instanceof Response);
}
async function waitRessource(res) {
    if (Array.isArray(res)) return await Promise.all(res.map((e)=>waitRessource(e)));
    if (res instanceof Promise) res = await res;
    if (res instanceof Response) res = await res.text();
    return res;
}


/***/ }),

/***/ "./V3/src/utils/parsers/html.ts":
/*!**************************************!*\
  !*** ./V3/src/utils/parsers/html.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ html)
/* harmony export */ });
/* harmony import */ var _isTemplateString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isTemplateString */ "./V3/src/utils/parsers/isTemplateString.ts");

const template = document.createElement("template");
const df = template.content;
function html(...raw) {
    let elem = raw[0];
    if ((0,_isTemplateString__WEBPACK_IMPORTED_MODULE_0__["default"])(raw)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    template.innerHTML = elem;
    if (df.childNodes.length !== 1) throw new Error("Error");
    return df.firstChild;
}


/***/ }),

/***/ "./V3/src/utils/parsers/index.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/parsers/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   style: () => (/* reexport safe */ _style__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   template: () => (/* reexport safe */ _template__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./V3/src/utils/parsers/html.ts");
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template */ "./V3/src/utils/parsers/template.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./V3/src/utils/parsers/style.ts");




src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].style = _style__WEBPACK_IMPORTED_MODULE_3__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].template = _template__WEBPACK_IMPORTED_MODULE_2__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].html = _html__WEBPACK_IMPORTED_MODULE_1__["default"];



/***/ }),

/***/ "./V3/src/utils/parsers/isTemplateString.ts":
/*!**************************************************!*\
  !*** ./V3/src/utils/parsers/isTemplateString.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTemplateString)
/* harmony export */ });
function isTemplateString(raw) {
    return Array.isArray(raw[0]);
}


/***/ }),

/***/ "./V3/src/utils/parsers/style.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/parsers/style.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ style)
/* harmony export */ });
function style(...raw) {
    let elem = raw[0];
    if (elem instanceof CSSStyleSheet) return elem;
    if (elem instanceof HTMLStyleElement) return elem.sheet;
    if (Array.isArray(elem)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    if (typeof elem !== "string") {
        console.warn(elem);
        console.trace();
        throw new Error("Should not occurs");
    }
    const style1 = new CSSStyleSheet();
    style1.replaceSync(elem);
    return style1;
}


/***/ }),

/***/ "./V3/src/utils/parsers/template.ts":
/*!******************************************!*\
  !*** ./V3/src/utils/parsers/template.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ template)
/* harmony export */ });
/* harmony import */ var _isTemplateString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isTemplateString */ "./V3/src/utils/parsers/isTemplateString.ts");

function template(...raw) {
    let elem = raw[0];
    if ((0,_isTemplateString__WEBPACK_IMPORTED_MODULE_0__["default"])(raw)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    if (elem instanceof DocumentFragment) return elem.cloneNode(true);
    // must use template as DocumentFragment doesn't have .innerHTML
    let template1 = document.createElement('template');
    if (typeof elem === 'string') template1.innerHTML = elem.trim();
    else {
        if (elem instanceof HTMLElement) // prevents issue if elem is latter updated.
        elem = elem.cloneNode(true);
        template1.append(elem);
    }
    //if( template.content.childNodes.length === 1 && template.content.firstChild!.nodeType !== Node.TEXT_NODE)
    //  return template.content.firstChild! as unknown as T;
    return template1.content;
}


/***/ }),

/***/ "./V3/src/utils/tests/assertElement.ts":
/*!*********************************************!*\
  !*** ./V3/src/utils/tests/assertElement.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assertElement)
/* harmony export */ });
/* harmony import */ var src_define_whenDefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/define/whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");

function waitFrame() {
    const { promise, resolve } = Promise.withResolvers();
    requestAnimationFrame(()=>resolve());
    return promise;
}
async function assertElement(tagname, opts = {}) {
    const shadow_html = opts.shadow_html ?? null;
    const css = opts.css ?? {};
    await (0,src_define_whenDefined__WEBPACK_IMPORTED_MODULE_0__["default"])(tagname);
    //for(let i = 0; i < 1; ++i)
    //    await waitFrame();
    const elem = document.querySelector(tagname);
    if (elem === null) throw new Error("Component not found");
    //TODO: await LISS.whenInitialized(elem); ?
    if (elem.tagName.toLowerCase() !== tagname) throw new Error(`Wrong tagname.
Expected: ${tagname}
Got: ${elem.tagName.toLowerCase()}`);
    if (elem.constructor.name === "HTMLElement") throw new Error(`Element not upgraded!`);
    if (shadow_html !== elem.shadowRoot) {
        if (shadow_html === null || elem.shadowRoot === null) throw new Error(`ShadowRoot missing or unexpected.`);
        if (shadow_html !== elem.shadowRoot.innerHTML) throw new Error(`HTML content mismatched.
Expected: ${shadow_html}
Got: ${elem.shadowRoot.innerHTML}`);
    }
    for(let selector in css){
        const expected = css[selector];
        let sub_elems;
        if (selector === "") sub_elems = [
            elem
        ];
        else sub_elems = (elem.content ?? elem.shadowRoot ?? elem).querySelectorAll(selector);
        if (sub_elems.length === 0) throw new Error(`Elements "${selector}" not found`);
        for (let sub_elem of sub_elems){
            // compare style : https://stackoverflow.com/questions/59342928/getcomputedstyle-only-the-changes-from-default
            //  ^ get all elements, find matching qs, compare
            // pseudo class  : https://stackoverflow.com/questions/32091848/template-queryselector-using-scope-pseudo-class-works-with-document-but-not
            const css = getComputedStyle(sub_elem);
            for(let propname in expected){
                const val = css.getPropertyValue(propname);
                if (val !== expected[propname]) {
                    throw new Error(`CSS mismatch
        Expected:${expected}
        Got: ${css}`);
                }
            }
        }
    }
}

src_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].assertElement = assertElement;


/***/ }),

/***/ "./V3/src/utils/tests/buildTestPage.ts":
/*!*********************************************!*\
  !*** ./V3/src/utils/tests/buildTestPage.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildTestPage)
/* harmony export */ });
// <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
function buildTestPage(args) {
    if (args.js === "" && args.html == "" && args.tagname !== undefined) args.html = `<${args.tagname}></${args.tagname}>`;
    return `<!DOCTYPE html>
        <head>
            <style>
                body {
                    margin: 0;
                    background-color: white;
                }
            </style>
            <script type="module" src='${args.liss}'
                    liss-mode="auto-load"
                    liss-cdir="${args.cdir}"
            ></script>
            <script type="module">
                ${args.js}
            </script>
        </head>
        <body>
            ${args.html}
        </body>
    </html>`;
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "";
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ __webpack_require__("./V3/pages/fr/index.ts");
/******/ __webpack_require__("./V3/pages/fr/index.css");
/******/ var __webpack_exports__ = __webpack_require__("./V3/pages/fr/index.md");
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__default as default };
/******/ 

//# sourceMappingURL=index.js.map