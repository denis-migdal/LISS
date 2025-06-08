import type {Cstr} from ".";

// static readonly SHADOW_MODE      : "open"|"closed"|null = null;
// static readonly CONTENT_GENERATOR: ContentGenerator|null = null;

// DOCUMENTER !
// move out whenDOMContentLoaded -> define all -> bare (init ?)
// (bare ?) + isReady ~> override and / whenReady ~> override and promise.All.
// is & when same object... ~> static...

export default function WithBare<T extends HTMLElement>(
                                    base : Cstr<T>,
                                    args: {

                                    }
                                ) {

    // @ts-ignore
    return class LISSContent extends base {
        
        readonly content  : ShadowRoot|HTMLElement;

        constructor(...args: any[]) {
            super(...args);

            this.content = CONTENT_GENERATOR.initContent(this,
                                                         SHADOW_MODE);
        }
    }

}