
import { Constructor } from "../types";

type ListenerFct<T extends Event> = (ev: T) => void;
type ListenerObj<T extends Event> = { handleEvent: ListenerFct<T> };
type Listener<T extends Event> = ListenerFct<T>|ListenerObj<T>;

export class EventTarget2<Events extends Record<string, Event>> extends EventTarget {

	override addEventListener<T extends Exclude<keyof Events, symbol|number>>(type: T,
																			  callback: Listener<Events[T]> | null,
																			  options?: AddEventListenerOptions | boolean): void {
		
		//@ts-ignore
		return super.addEventListener(type, callback, options);
	}

	override dispatchEvent<T extends Exclude<keyof Events, symbol|number>>(event: Events[T]): boolean {
		return super.dispatchEvent(event);
	}

	override removeEventListener<T extends Exclude<keyof Events, symbol|number>>(type: T,
																				 listener: Listener<Events[T]> | null,
																				 options?: boolean|AddEventListenerOptions): void {

		//@ts-ignore
		super.removeEventListener(type, listener, options);
	}
}

export class CustomEvent2<T extends string, Args> extends CustomEvent<Args> {

	constructor(type: T, args: Args) {
		super(type, {detail: args});
	}

	override get type(): T { return super.type as T; }
}

type Instances<T extends Record<string, Constructor<Event>>> = {
	[K in keyof T]: InstanceType<T[K]>
}

export function WithEvents<T extends object, Events extends Record<string, Constructor<Event>> >(ev: Constructor<T>, _events: Events) {

	type Evts = Instances<Events>;

	if( ! (ev instanceof EventTarget) )
		return ev as Constructor<Omit<T, keyof EventTarget> & EventTarget2<Evts>>;

	// is also a mixin
	// @ts-ignore
	class EventTargetMixins extends ev {

		#ev = new EventTarget2<Evts>();

		addEventListener(...args:any[]) {
			// @ts-ignore
			return this.#ev.addEventListener(...args);
		}
		removeEventListener(...args:any[]) {
			// @ts-ignore
			return this.#ev.removeEventListener(...args);
		}
		dispatchEvent(...args:any[]) {
			// @ts-ignore
			return this.#ev.dispatchEvent(...args);
		}
	}
	
	return EventTargetMixins as unknown as Constructor<Omit<T, keyof EventTarget> & EventTarget2<Evts>>;
}

// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================


export function eventMatches(ev: Event, selector: string) {

	let elements = ev.composedPath().slice(0,-2).filter(e => ! (e instanceof ShadowRoot) ).reverse() as HTMLElement[];

	for(let elem of elements )
		if(elem.matches(selector) )
			return elem; 

	return null;
}