// https://github.com/denis-migdal/LISS/issues/1

import LISS from '../index';

class MyComponent extends LISS({
	host   : HTMLTableRowElement
}) { }

LISS.define('my-component', MyComponent);