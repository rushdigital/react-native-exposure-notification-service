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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPermissions = exports.getPermissions = void 0;
const react_native_permissions_1 = __importStar(require("react-native-permissions"));
const exposure_notification_module_1 = __importDefault(require("../exposure-notification-module"));
const types_1 = require("../types");
const Check2Status = {
    [react_native_permissions_1.RESULTS.UNAVAILABLE]: types_1.PermissionStatus.NotAvailable,
    [react_native_permissions_1.RESULTS.DENIED]: types_1.PermissionStatus.Unknown,
    [react_native_permissions_1.RESULTS.GRANTED]: types_1.PermissionStatus.Allowed,
    [react_native_permissions_1.RESULTS.BLOCKED]: types_1.PermissionStatus.NotAllowed,
    unknown: types_1.PermissionStatus.Unknown
};
const getPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    const perms = [
        exposure_notification_module_1.default.isAuthorised(),
        react_native_permissions_1.default.checkNotifications()
    ];
    try {
        const [exposureResponse, notifsResp] = yield Promise.all(perms);
        let notificationsStatus = Check2Status[notifsResp.status];
        return {
            exposure: {
                status: Check2Status[exposureResponse]
            },
            notifications: {
                status: notificationsStatus,
                internal: notifsResp
            }
        };
    }
    catch (e) {
        console.log('getPermissions error', e);
        return {
            exposure: { status: types_1.PermissionStatus.Unknown },
            notifications: { status: types_1.PermissionStatus.Unknown }
        };
    }
});
exports.getPermissions = getPermissions;
const requestPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('request:  exposure permissions');
        const exposureResult = yield exposure_notification_module_1.default.authoriseExposure();
        console.log('exposureResult', exposureResult);
    }
    catch (e) {
        console.log('exposureError', e);
    }
    try {
        console.log('requestNotifications');
        const notificationsResult = yield react_native_permissions_1.default.requestNotifications([
            'alert',
            'badge',
            'sound'
        ]);
        console.log('notificationsResult', notificationsResult);
    }
    catch (e) {
        console.log('notificationsError', e);
    }
});
exports.requestPermissions = requestPermissions;
