import LISS from "LISS";

export default function(options) {

	return class LISSComponent extends LISS(options) {

		constructor() {
			super();
			
			// do stuff...
			const COLORS = ['blue', 'yellow'];
			let cidx   = 0;

			this.host.style.setProperty('--color', COLORS[cidx]);

			setInterval(() => {
				this.host.style.setProperty('--color', COLORS[cidx = ++cidx % COLORS.length] );
			}, 1000);
		}
	}

}

