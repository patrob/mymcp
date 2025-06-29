/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateServerInstanceDto } from '../models/CreateServerInstanceDto';
import type { UpdateServerInstanceDto } from '../models/UpdateServerInstanceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServersService {
    /**
     * Get all servers for the authenticated user
     * @returns any OK
     * @throws ApiError
     */
    public static getServers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/servers',
        });
    }
    /**
     * Create a new server instance
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static createServer(
        requestBody: CreateServerInstanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/servers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a specific server by ID
     * @param serverId
     * @returns any OK
     * @throws ApiError
     */
    public static getServerById(
        serverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/servers/{serverId}',
            path: {
                'serverId': serverId,
            },
        });
    }
    /**
     * Update an existing server instance
     * @param serverId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static updateServer(
        serverId: string,
        requestBody: UpdateServerInstanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/servers/{serverId}',
            path: {
                'serverId': serverId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a server instance
     * @param serverId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteServer(
        serverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/servers/{serverId}',
            path: {
                'serverId': serverId,
            },
        });
    }
    /**
     * Start a server instance
     * @param serverId
     * @returns any OK
     * @throws ApiError
     */
    public static startServer(
        serverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/servers/{serverId}/start',
            path: {
                'serverId': serverId,
            },
        });
    }
    /**
     * Stop a server instance
     * @param serverId
     * @returns any OK
     * @throws ApiError
     */
    public static stopServer(
        serverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/servers/{serverId}/stop',
            path: {
                'serverId': serverId,
            },
        });
    }
}
