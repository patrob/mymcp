/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { McpServerTemplateDto } from './McpServerTemplateDto';
import type { ServerStatus } from './ServerStatus';
export type ServerInstanceDto = {
    id: string;
    name: string;
    description?: string | null;
    status: ServerStatus;
    containerInstanceId?: string | null;
    createdAt: string;
    updatedAt: string;
    lastStartedAt?: string | null;
    lastStoppedAt?: string | null;
    template: McpServerTemplateDto;
};

