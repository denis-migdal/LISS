
// ================================================
// =============== LISS EventsTarget ==============
// ================================================

type CstEvent<Event extends string, Args> = CustomEvent<Args> & {type: Event};

export interface EventsTarget<Events extends Record<string, any>>{

	addEventListener<Event extends Exclude<keyof Events, symbol|number>>(type: Event,
												 listener: null| ((ev: CstEvent<Event, Events[Event]>) => void),
												 options?: boolean|AddEventListenerOptions): void;

	dispatchEvent<Event extends Exclude<keyof Events, symbol|number>>(event: CstEvent<Event, Events[Event]>): boolean;

	removeEventListener<Event extends Exclude<keyof Events, symbol|number>>(type: Event,
													listener: null| ((ev: CstEvent<Event, Events[Event]>) => void),
													options?: boolean|AddEventListenerOptions): void;
}

export class CstmEvent<Event extends string, Args> extends CustomEvent<Args> {

	override get type(): Event { return super.type as Event; }

	constructor(type: Event, args: Args) {
		super(type, {detail: args});
	}
}

export type EventsTargetCstr<Events extends Record<string,any>> = Constructor<EventsTarget<Events>>;

// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================

type DelegatedHandler = [string, (ev: MouseEvent) => void];
const DELEGATED_EVENTS = {
	"click": [] as DelegatedHandler[],
	"dblclick": [] as DelegatedHandler[]
};

const ALREADY_PROCESSED = Symbol();

function onClickEvent(ev: MouseEvent) {

	if( (ev as any)[ALREADY_PROCESSED] === true )
		return;
	(ev as any)[ALREADY_PROCESSED] = true;

	const handlers = DELEGATED_EVENTS[ev.type as keyof typeof DELEGATED_EVENTS];

	for(let elem of ev.composedPath() ) {
	
		if( elem instanceof ShadowRoot || elem === document || elem === window )
			continue;

		var target = elem as Element;

		for(let [selector, handler] of handlers) {
			if( target.matches(selector) )
				handler(ev);
		}
	}
}

LISS.insertGlobalDelegatedListener = function(event_name: keyof typeof DELEGATED_EVENTS, selector: string, handler: (ev: MouseEvent) => void ) {
	DELEGATED_EVENTS[event_name].push([selector, handler])
}

document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);
