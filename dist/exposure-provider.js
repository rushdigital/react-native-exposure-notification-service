"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExposure = exports.ExposureProvider = exports.getConfigData = exports.getBundleId = exports.getVersion = exports.ExposureContext = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const exposure_notification_module_1 = __importStar(require("./exposure-notification-module"));
const permissions_1 = require("./utils/permissions");
const types_1 = require("./types");
const emitter = new react_native_1.NativeEventEmitter(exposure_notification_module_1.default);
const initialState = {
    status: {
        state: exposure_notification_module_1.StatusState.unavailable,
        type: [exposure_notification_module_1.StatusType.starting]
    },
    supported: false,
    canSupport: false,
    isAuthorised: 'unknown',
    enabled: false,
    contacts: [],
    initialised: false,
    permissions: {
        exposure: { status: types_1.PermissionStatus.Unknown },
        notifications: { status: types_1.PermissionStatus.Unknown }
    }
};
exports.ExposureContext = react_1.createContext(Object.assign(Object.assign({}, initialState), { start: () => Promise.resolve(false), stop: () => { }, pause: () => Promise.resolve(false), configure: () => { }, checkExposure: () => { }, simulateExposure: () => { }, getDiagnosisKeys: () => Promise.resolve([]), exposureEnabled: () => Promise.resolve(false), authoriseExposure: () => Promise.resolve(false), deleteAllData: () => Promise.resolve(), supportsExposureApi: () => Promise.resolve(), getCloseContacts: () => Promise.resolve([]), getLogData: () => Promise.resolve({}), triggerUpdate: () => Promise.resolve(undefined), deleteExposureData: () => Promise.resolve(), readPermissions: () => Promise.resolve(), askPermissions: () => Promise.resolve(), setExposureState: () => { }, cancelNotifications: () => { } }));
exports.getVersion = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exposure_notification_module_1.default.version();
        return result;
    }
    catch (e) {
        console.log('build version error', e);
    }
});
exports.getBundleId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exposure_notification_module_1.default.bundleId();
        return result;
    }
    catch (e) {
        console.log('bundle id error', e);
    }
});
exports.getConfigData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exposure_notification_module_1.default.getConfigData();
        return result;
    }
    catch (e) {
        console.log('getConfigData error', e);
    }
});
exports.ExposureProvider = ({ children, isReady = false, traceConfiguration, serverUrl, keyServerUrl, keyServerType = exposure_notification_module_1.KeyServerType.nearform, authToken = '', refreshToken = '', notificationTitle, notificationDescription, callbackNumber = '', analyticsOptin = false, notificationRepeat = 0, certList = '', hideForeground = false }) => {
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        function handleEvent(ev = {}) {
            console.log(`exposureEvent: ${JSON.stringify(ev)}`);
            if (ev.onStatusChanged) {
                return validateStatus(ev.onStatusChanged);
            }
        }
        let subscription = emitter.addListener('exposureEvent', handleEvent);
        const listener = (type) => {
            if (type === 'active') {
                validateStatus();
                getCloseContacts();
            }
        };
        react_native_1.AppState.addEventListener('change', listener);
        return () => {
            subscription.remove();
            emitter.removeListener('exposureEvent', handleEvent);
            react_native_1.AppState.removeEventListener('change', listener);
        };
    }, []);
    react_1.useEffect(() => {
        function checkSupportAndStart() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                yield supportsExposureApi();
                // Start as soon as we're able to
                if (isReady &&
                    state.permissions.exposure.status === types_1.PermissionStatus.Allowed) {
                    yield configure();
                    const latestStatus = yield exposure_notification_module_1.default.status();
                    if (!(latestStatus &&
                        (((_a = latestStatus.type) === null || _a === void 0 ? void 0 : _a.indexOf(exposure_notification_module_1.StatusType.paused)) > -1 ||
                            ((_b = latestStatus.type) === null || _b === void 0 ? void 0 : _b.indexOf(exposure_notification_module_1.StatusType.stopped)) > -1))) {
                        start();
                    }
                }
            });
        }
        checkSupportAndStart();
    }, [
        state.permissions.exposure.status,
        state.permissions.notifications.status,
        isReady
    ]);
    const supportsExposureApi = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const can = yield exposure_notification_module_1.default.canSupport();
            const is = yield exposure_notification_module_1.default.isSupported();
            const status = yield exposure_notification_module_1.default.status();
            const enabled = yield exposure_notification_module_1.default.exposureEnabled();
            const isAuthorised = yield exposure_notification_module_1.default.isAuthorised();
            setState((s) => (Object.assign(Object.assign({}, s), { status,
                enabled, canSupport: can, supported: is, isAuthorised })));
            yield validateStatus(status);
            yield getCloseContacts();
        });
    };
    const validateStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let newStatus = status || (yield exposure_notification_module_1.default.status());
        const enabled = yield exposure_notification_module_1.default.exposureEnabled();
        const isAuthorised = yield exposure_notification_module_1.default.isAuthorised();
        const canSupport = yield exposure_notification_module_1.default.canSupport();
        const isStarting = (isAuthorised === exposure_notification_module_1.AuthorisedStatus.unknown ||
            isAuthorised === exposure_notification_module_1.AuthorisedStatus.granted) &&
            newStatus.state === exposure_notification_module_1.StatusState.unavailable && ((_a = newStatus.type) === null || _a === void 0 ? void 0 : _a.includes(exposure_notification_module_1.StatusType.starting));
        const initialised = !isStarting || !canSupport;
        setState((s) => (Object.assign(Object.assign({}, s), { status: newStatus, enabled,
            isAuthorised,
            canSupport,
            initialised })));
    });
    const start = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield exposure_notification_module_1.default.start();
            yield validateStatus();
            yield getCloseContacts();
            return result;
        }
        catch (err) {
            console.log('start err', err);
        }
    });
    const pause = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield exposure_notification_module_1.default.pause();
            yield validateStatus();
            return result;
        }
        catch (err) {
            console.log('pause err', err);
        }
    });
    const stop = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield exposure_notification_module_1.default.stop();
            yield validateStatus();
        }
        catch (err) {
            console.log('stop err', err);
        }
    });
    const configure = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const config = {
                exposureCheckFrequency: traceConfiguration.exposureCheckInterval,
                serverURL: serverUrl,
                keyServerUrl,
                keyServerType,
                authToken,
                refreshToken,
                storeExposuresFor: traceConfiguration.storeExposuresFor,
                notificationTitle,
                notificationDesc: notificationDescription,
                callbackNumber,
                analyticsOptin,
                notificationRepeat,
                certList,
                hideForeground
            };
            yield exposure_notification_module_1.default.configure(config);
            return true;
        }
        catch (err) {
            console.log('configure err', err);
            return false;
        }
    });
    const checkExposure = (skipTimeCheck) => {
        exposure_notification_module_1.default.checkExposure(skipTimeCheck);
    };
    const simulateExposure = (timeDelay, exposureDays) => {
        exposure_notification_module_1.default.simulateExposure(timeDelay, exposureDays);
    };
    const getDiagnosisKeys = () => {
        return exposure_notification_module_1.default.getDiagnosisKeys();
    };
    const exposureEnabled = () => __awaiter(void 0, void 0, void 0, function* () {
        return exposure_notification_module_1.default.exposureEnabled();
    });
    const authoriseExposure = () => __awaiter(void 0, void 0, void 0, function* () {
        return exposure_notification_module_1.default.authoriseExposure();
    });
    const deleteAllData = () => __awaiter(void 0, void 0, void 0, function* () {
        yield exposure_notification_module_1.default.deleteAllData();
        yield validateStatus();
    });
    const getCloseContacts = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const contacts = yield exposure_notification_module_1.default.getCloseContacts();
            setState((s) => (Object.assign(Object.assign({}, s), { contacts })));
            return contacts;
        }
        catch (err) {
            console.log('getCloseContacts err', err);
            return null;
        }
    });
    const getLogData = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield exposure_notification_module_1.default.getLogData();
            return data;
        }
        catch (err) {
            console.log('getLogData err', err);
            return null;
        }
    });
    const triggerUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield exposure_notification_module_1.default.triggerUpdate();
            console.log('trigger update: ', result);
            // this will not occur after play services update available to public
            if (result === 'api_not_available') {
                react_native_1.Alert.alert('API Not Available', 'Google Exposure Notifications API not available on this device yet');
            }
            return result;
        }
        catch (e) {
            console.log('trigger update error', e);
        }
    });
    const deleteExposureData = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield exposure_notification_module_1.default.deleteExposureData();
            setState((s) => (Object.assign(Object.assign({}, s), { contacts: [] })));
        }
        catch (e) {
            console.log('delete exposure data error', e);
        }
    });
    const cancelNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            exposure_notification_module_1.default.cancelNotifications();
        }
        catch (e) {
            console.log('cancel notifications exposure data error', e);
        }
    });
    const readPermissions = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Read permissions...');
        const perms = yield permissions_1.getPermissions();
        console.log('perms: ', JSON.stringify(perms, null, 2));
        setState((s) => (Object.assign(Object.assign({}, s), { permissions: perms })));
    }), []);
    const askPermissions = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Requesting permissions...', state.permissions);
        yield permissions_1.requestPermissions();
        yield readPermissions();
    }), []);
    react_1.useEffect(() => {
        readPermissions();
    }, [readPermissions]);
    const value = Object.assign(Object.assign({}, state), { start,
        stop,
        pause,
        configure,
        checkExposure,
        simulateExposure,
        getDiagnosisKeys,
        exposureEnabled,
        authoriseExposure,
        deleteAllData,
        supportsExposureApi,
        getCloseContacts,
        getLogData,
        triggerUpdate,
        deleteExposureData,
        readPermissions,
        askPermissions, setExposureState: setState, cancelNotifications });
    return (react_1.default.createElement(exports.ExposureContext.Provider, { value: value }, children));
};
exports.useExposure = () => react_1.useContext(exports.ExposureContext);
