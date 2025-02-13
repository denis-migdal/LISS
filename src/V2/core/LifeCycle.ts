import LISS from "../extends";


import {States} from "../LifeCycle/states.ts";

declare module "../extends" {
    interface ILISS {
        States         : typeof States
		// whenAllDefined : typeof whenAllDefined;
    }
}

LISS.States = States;


import {define, getName, isDefined, whenDefined, getHostCstr, getHostCstrSync} from "../LifeCycle/DEFINED";

declare module "../extends" {
    interface ILISS {
        define         : typeof define;
		getName        : typeof getName;
		isDefined      : typeof isDefined;
		whenDefined    : typeof whenDefined;
		getHostCstr    : typeof getHostCstr;
		getHostCstrSync: typeof getHostCstrSync;
		// whenAllDefined : typeof whenAllDefined;
    }
}

LISS.define         = define;
LISS.getName        = getName;
LISS.isDefined      = isDefined;
LISS.whenDefined    = whenDefined;
LISS.getHostCstr    = getHostCstr;
LISS.getHostCstrSync= getHostCstrSync;

//LISS.whenAllDefined = whenAllDefined;

import {isReady, whenReady, getControlerCstr, getControlerCstrSync} from "../LifeCycle/READY";

declare module "../extends" {
    interface ILISS {
		isReady      : typeof isReady;
		whenReady    : typeof whenReady;
		getControlerCstr    : typeof getControlerCstr;
		getControlerCstrSync: typeof getControlerCstrSync;
    }
}

LISS.isReady             = isReady;
LISS.whenReady           = whenReady;
LISS.getControlerCstr    = getControlerCstr;
LISS.getControlerCstrSync= getControlerCstrSync;



import {isUpgraded, whenUpgraded, upgrade, upgradeSync, getHost, getHostSync} from "../LifeCycle/UPGRADED";

declare module "../extends" {
    interface ILISS {
		isUpgraded  : typeof isUpgraded;
		whenUpgraded: typeof whenUpgraded;
		upgrade     : typeof upgrade;
		upgradeSync : typeof upgradeSync;
		getHost     : typeof getHost;
		getHostSync : typeof getHostSync;
    }
}

LISS.isUpgraded  = isUpgraded;
LISS.whenUpgraded= whenUpgraded;
LISS.upgrade     = upgrade;
LISS.upgradeSync = upgradeSync;
LISS.getHost     = getHost;
LISS.getHostSync = getHostSync;


import {isInitialized, whenInitialized, initialize, initializeSync, getControler, getControlerSync} from "../LifeCycle/INITIALIZED";

declare module "../extends" {
    interface ILISS {
		isInitialized    : typeof isInitialized;
		whenInitialized  : typeof whenInitialized;
		initialize       : typeof initialize;
		initializeSync   : typeof initializeSync;
		getControler     : typeof getControler;
		getControlerSync : typeof getControlerSync;
    }
}

LISS.isInitialized    = isInitialized;
LISS.whenInitialized  = whenInitialized;
LISS.initialize       = initialize;
LISS.initializeSync   = initializeSync;
LISS.getControler     = getControler;
LISS.getControlerSync = getControlerSync;