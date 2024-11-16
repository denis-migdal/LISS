
import { DEFINED, getState, initialize, INITIALIZED, initializeSync, READY, upgrade, UPGRADED, upgradeSync, whenInitialized, whenUpgraded } from "../state";
import LISS from "../extends";

declare module "../extends" {
    interface ILISS {
        DEFINED    : typeof DEFINED,
        READY      : typeof READY;
        UPGRADED   : typeof UPGRADED;
        INITIALIZED: typeof INITIALIZED;
        getState       : typeof getState;
        upgrade        : typeof upgrade;
        initialize     : typeof initialize;
        upgradeSync    : typeof upgradeSync;
        initializeSync : typeof initializeSync;
        whenUpgraded   : typeof whenUpgraded;
        whenInitialized: typeof whenInitialized;
    }
}

LISS.DEFINED    = LISS.DEFINED,
LISS.READY      = LISS.READY;
LISS.UPGRADED   = LISS.UPGRADED;
LISS.INITIALIZED= LISS.INITIALIZED;

LISS.getState       = getState;
LISS.upgrade        = upgrade;
LISS.initialize     = initialize;
LISS.upgradeSync    = upgradeSync;
LISS.initializeSync = initializeSync;
LISS.whenUpgraded   = whenUpgraded;
LISS.whenInitialized= whenInitialized;