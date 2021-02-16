import React, { SetStateAction } from 'react';
import { AuthorisedStatus, Status, CloseContact, KeyServerType } from './exposure-notification-module';
import { ExposurePermissions, TraceConfiguration } from './types';
interface State {
    status: Status;
    supported: boolean;
    canSupport: boolean;
    isAuthorised: AuthorisedStatus;
    enabled: boolean;
    contacts?: CloseContact[];
    initialised: boolean;
    permissions: ExposurePermissions;
}
export interface ExposureContextValue extends State {
    start: () => Promise<boolean>;
    stop: () => void;
    pause: () => Promise<boolean>;
    configure: () => void;
    checkExposure: (skipTimeCheck: boolean) => void;
    simulateExposure: (timeDelay: number, exposureDays: number) => void;
    getDiagnosisKeys: () => Promise<any[]>;
    exposureEnabled: () => Promise<boolean>;
    authoriseExposure: () => Promise<boolean>;
    deleteAllData: () => Promise<void>;
    supportsExposureApi: () => Promise<void>;
    getCloseContacts: () => Promise<CloseContact[]>;
    getLogData: () => Promise<{
        [key: string]: any;
    }>;
    triggerUpdate: () => Promise<string | undefined>;
    deleteExposureData: () => Promise<void>;
    readPermissions: () => Promise<void>;
    askPermissions: () => Promise<void>;
    setExposureState: (setStateAction: SetStateAction<State>) => void;
    cancelNotifications: () => void;
}
export declare const ExposureContext: React.Context<ExposureContextValue>;
export interface ExposureProviderProps {
    isReady: boolean;
    traceConfiguration: TraceConfiguration;
    serverUrl: string;
    keyServerUrl: string;
    keyServerType: KeyServerType;
    authToken: string;
    refreshToken: string;
    notificationTitle: string;
    notificationDescription: string;
    callbackNumber?: string;
    analyticsOptin?: boolean;
    notificationRepeat?: number;
    certList?: string;
    hideNotification?: boolean;
}
export declare const getVersion: () => Promise<import("./types").Version>;
export declare const getBundleId: () => Promise<string>;
export declare const getConfigData: () => Promise<any>;
export declare const ExposureProvider: React.FC<ExposureProviderProps>;
export declare const useExposure: () => ExposureContextValue;
export {};
