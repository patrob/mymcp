/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServerStatus } from './ServerStatus';
export type ServerHealthResponse = {
    isHealthy: boolean;
    status: ServerStatus;
    lastChecked: string;
    errorMessage?: string | null;
};

