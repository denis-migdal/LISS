import isPageLoaded from "./isPageLoaded";

export default async function whenDOMContentLoaded() {
    if( isPageLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('load', resolve as any, true);

    await promise;
}

/*
export async function whenDOMContentLoaded() {
    if( isDOMContentLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);

    await promise;
}*/