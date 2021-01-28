"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusType = exports.StatusState = exports.KeyServerType = exports.AuthorisedStatus = void 0;
const react_native_1 = require("react-native");
var AuthorisedStatus;
(function (AuthorisedStatus) {
    AuthorisedStatus["granted"] = "granted";
    AuthorisedStatus["denied"] = "denied";
    AuthorisedStatus["blocked"] = "blocked";
    AuthorisedStatus["unavailable"] = "unavailable";
    AuthorisedStatus["unknown"] = "unknown";
})(AuthorisedStatus = exports.AuthorisedStatus || (exports.AuthorisedStatus = {}));
var KeyServerType;
(function (KeyServerType) {
    KeyServerType["nearform"] = "nearform";
    KeyServerType["google"] = "google";
})(KeyServerType = exports.KeyServerType || (exports.KeyServerType = {}));
var StatusState;
(function (StatusState) {
    StatusState["unavailable"] = "unavailable";
    StatusState["unknown"] = "unknown";
    StatusState["restricted"] = "restricted";
    StatusState["disabled"] = "disabled";
    StatusState["active"] = "active";
})(StatusState = exports.StatusState || (exports.StatusState = {}));
var StatusType;
(function (StatusType) {
    StatusType["bluetooth"] = "bluetooth";
    StatusType["exposure"] = "exposure";
    StatusType["resolution"] = "resolution";
    StatusType["paused"] = "paused";
    StatusType["starting"] = "starting";
    StatusType["stopped"] = "stopped";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
const { ExposureNotificationModule: NativeExposureNotificationModule } = react_native_1.NativeModules;
exports.default = NativeExposureNotificationModule;
