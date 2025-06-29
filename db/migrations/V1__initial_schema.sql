-- Initial schema for OnParDev MyMcp application

-- Users table
CREATE TABLE "Users" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ClerkUserId" VARCHAR(256) NOT NULL UNIQUE,
    "Email" VARCHAR(256) NOT NULL UNIQUE,
    "FirstName" VARCHAR(128),
    "LastName" VARCHAR(128),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- MCP Server Templates table
CREATE TABLE "McpServerTemplates" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(128) NOT NULL,
    "Description" VARCHAR(512),
    "Version" VARCHAR(32) NOT NULL,
    "Category" VARCHAR(64) NOT NULL,
    "DocumentationUrl" VARCHAR(512),
    "RepositoryUrl" VARCHAR(512),
    "Capabilities" JSONB NOT NULL DEFAULT '[]',
    "DefaultConfiguration" JSONB NOT NULL DEFAULT '{}',
    "IsOfficial" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Container Specs table
CREATE TABLE "ContainerSpecs" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(128) NOT NULL,
    "Description" VARCHAR(512),
    "ImageName" VARCHAR(256) NOT NULL,
    "ImageTag" VARCHAR(64) NOT NULL,
    "CpuLimit" INTEGER NOT NULL DEFAULT 1000,
    "MemoryLimit" INTEGER NOT NULL DEFAULT 512,
    "EnvironmentVariables" JSONB NOT NULL DEFAULT '{}',
    "Ports" JSONB NOT NULL DEFAULT '[]',
    "Volumes" JSONB NOT NULL DEFAULT '[]',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Server Instances table
CREATE TABLE "ServerInstances" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(128) NOT NULL,
    "Description" VARCHAR(512),
    "UserId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "McpServerTemplateId" UUID NOT NULL REFERENCES "McpServerTemplates"("Id") ON DELETE RESTRICT,
    "ContainerSpecId" UUID NOT NULL REFERENCES "ContainerSpecs"("Id") ON DELETE RESTRICT,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Stopped',
    "ContainerInstanceId" VARCHAR(256),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "LastStartedAt" TIMESTAMP WITH TIME ZONE,
    "LastStoppedAt" TIMESTAMP WITH TIME ZONE
);

-- Server Logs table
CREATE TABLE "ServerLogs" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ServerInstanceId" UUID NOT NULL REFERENCES "ServerInstances"("Id") ON DELETE CASCADE,
    "Level" VARCHAR(32) NOT NULL,
    "Message" TEXT NOT NULL,
    "Source" VARCHAR(128),
    "Metadata" JSONB,
    "Timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Deployment Audits table
CREATE TABLE "DeploymentAudits" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ServerInstanceId" UUID NOT NULL REFERENCES "ServerInstances"("Id") ON DELETE CASCADE,
    "Action" VARCHAR(64) NOT NULL,
    "Status" VARCHAR(32) NOT NULL,
    "ErrorMessage" VARCHAR(1024),
    "Details" JSONB,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "Duration" INTERVAL
);

-- Indexes for performance
CREATE INDEX "IX_Users_ClerkUserId" ON "Users"("ClerkUserId");
CREATE INDEX "IX_Users_Email" ON "Users"("Email");
CREATE INDEX "IX_ServerLogs_ServerInstanceId_Timestamp" ON "ServerLogs"("ServerInstanceId", "Timestamp");
CREATE INDEX "IX_DeploymentAudits_ServerInstanceId_CreatedAt" ON "DeploymentAudits"("ServerInstanceId", "CreatedAt");

-- Update triggers for UpdatedAt columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcpservertemplates_updated_at BEFORE UPDATE ON "McpServerTemplates"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_containerspecs_updated_at BEFORE UPDATE ON "ContainerSpecs"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_serverinstances_updated_at BEFORE UPDATE ON "ServerInstances"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();