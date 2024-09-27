// ==========================================================

LISS.initialize = async function<T extends LISSBase<any,any,any,any>>( element: Element) {

	await LISS.whenDefined( LISS.getName(element) );

	return await (element as LISSHost<T>).initialize(); // ensure initialization.
}

LISS.initializeSync = function<T extends LISSBase<any,any,any,any>>( element: Element) {

	const name = LISS.getName(element);
	if( ! LISS.isDefined(name) )
		throw new Error(`${name} not defined`);

	return (element as LISSHost<T>).initialize(); // ensure initialization.
}