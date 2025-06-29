/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnonymousTypeOfstringAndDateTime } from '../models/AnonymousTypeOfstringAndDateTime';
import type { ConfigurationResponse } from '../models/ConfigurationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OnParDevMyMcpApiService {
    /**
     * @returns AnonymousTypeOfstringAndDateTime OK
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<AnonymousTypeOfstringAndDateTime> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/health',
        });
    }
    /**
     * @returns ConfigurationResponse OK
     * @throws ApiError
     */
    public static getConfiguration(): CancelablePromise<ConfigurationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/config',
        });
    }
}
