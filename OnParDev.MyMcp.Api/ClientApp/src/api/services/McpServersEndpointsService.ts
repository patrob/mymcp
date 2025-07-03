/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGitHubServerRequest } from '../models/CreateGitHubServerRequest';
import type { ServerHealthResponse } from '../models/ServerHealthResponse';
import type { ServerInstanceDto } from '../models/ServerInstanceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class McpServersEndpointsService {
    /**
     * Create a new GitHub MCP server instance
     * @param requestBody
     * @returns ServerInstanceDto Created
     * @throws ApiError
     */
    public static createGitHubServer(
        requestBody: CreateGitHubServerRequest,
    ): CancelablePromise<ServerInstanceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/mcp-servers/github',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get MCP server details
     * @param id
     * @returns ServerInstanceDto OK
     * @throws ApiError
     */
    public static getMcpServer(
        id: string,
    ): CancelablePromise<ServerInstanceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mcp-servers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Delete an MCP server
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteMcpServer(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/mcp-servers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Get all MCP servers for the current user
     * @returns ServerInstanceDto OK
     * @throws ApiError
     */
    public static getUserMcpServers(): CancelablePromise<Array<ServerInstanceDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mcp-servers',
        });
    }
    /**
     * Start an MCP server
     * @param id
     * @returns ServerInstanceDto OK
     * @throws ApiError
     */
    public static startMcpServer(
        id: string,
    ): CancelablePromise<ServerInstanceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/mcp-servers/{id}/start',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Stop an MCP server
     * @param id
     * @returns ServerInstanceDto OK
     * @throws ApiError
     */
    public static stopMcpServer(
        id: string,
    ): CancelablePromise<ServerInstanceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/mcp-servers/{id}/stop',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Get MCP server health status
     * @param id
     * @returns ServerHealthResponse OK
     * @throws ApiError
     */
    public static getMcpServerHealth(
        id: string,
    ): CancelablePromise<ServerHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mcp-servers/{id}/health',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
}
