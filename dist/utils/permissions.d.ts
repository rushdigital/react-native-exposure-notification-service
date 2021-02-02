import { ExposurePermissions } from '../types';
declare const getPermissions: () => Promise<ExposurePermissions>;
declare const requestPermissions: () => Promise<void>;
export { getPermissions, requestPermissions };
