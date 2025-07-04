﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using OnParDev.MyMcp.Api.Infrastructure.Data;

#nullable disable

namespace OnParDev.MyMcp.Api.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ContainerSpec", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("CpuLimit")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<string>("EnvironmentVariables")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImageName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("ImageTag")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<int>("MemoryLimit")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Ports")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Volumes")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ContainerSpecs");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.DeploymentAudit", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Action")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Details")
                        .HasColumnType("text");

                    b.Property<TimeSpan?>("Duration")
                        .HasColumnType("interval");

                    b.Property<string>("ErrorMessage")
                        .HasMaxLength(1024)
                        .HasColumnType("character varying(1024)");

                    b.Property<Guid>("ServerInstanceId")
                        .HasColumnType("uuid");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.HasKey("Id");

                    b.HasIndex("ServerInstanceId", "CreatedAt");

                    b.ToTable("DeploymentAudits");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.McpServerTemplate", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Capabilities")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DefaultConfiguration")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<string>("DocumentationUrl")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<bool>("IsOfficial")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("RepositoryUrl")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.HasKey("Id");

                    b.ToTable("McpServerTemplates");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ContainerInstanceId")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<Guid>("ContainerSpecId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<DateTime?>("LastStartedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("LastStoppedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("McpServerTemplateId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ContainerSpecId");

                    b.HasIndex("McpServerTemplateId");

                    b.HasIndex("UserId");

                    b.ToTable("ServerInstances");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ServerLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Metadata")
                        .HasColumnType("text");

                    b.Property<Guid>("ServerInstanceId")
                        .HasColumnType("uuid");

                    b.Property<string>("Source")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ServerInstanceId", "Timestamp");

                    b.ToTable("ServerLogs");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ClerkUserId")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("LastName")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ClerkUserId")
                        .IsUnique();

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Configuration.Entities.ConfigurationSetting", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("Key")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(1024)
                        .HasColumnType("character varying(1024)");

                    b.HasKey("Id");

                    b.HasIndex("Key")
                        .IsUnique();

                    b.ToTable("ConfigurationSettings");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Plan", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("BillingCycle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("PlanTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("PlanTypeName", "BillingCycle")
                        .IsUnique();

                    b.ToTable("Plans");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Subscription", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("NextBillingDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("PlanId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StripeSubscriptionId")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("PlanId");

                    b.HasIndex("StripeSubscriptionId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Subscriptions");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Usage.Entities.RequestLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Endpoint")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<string>("Method")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("character varying(16)");

                    b.Property<DateTime>("RequestTimestamp")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ResponseCode")
                        .HasColumnType("integer");

                    b.Property<long>("ResponseTimeMs")
                        .HasColumnType("bigint");

                    b.Property<Guid>("ServerInstanceId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserUsageId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ServerInstanceId");

                    b.HasIndex("UserUsageId");

                    b.HasIndex("UserId", "RequestTimestamp");

                    b.ToTable("RequestLogs");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Usage.Entities.UserUsage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Month")
                        .HasColumnType("integer");

                    b.Property<int>("RequestCount")
                        .HasColumnType("integer");

                    b.Property<Guid>("SubscriptionId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<int>("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SubscriptionId");

                    b.HasIndex("UserId", "Year", "Month")
                        .IsUnique();

                    b.ToTable("UserUsages");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.DeploymentAudit", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", "ServerInstance")
                        .WithMany("DeploymentAudits")
                        .HasForeignKey("ServerInstanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ServerInstance");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.ContainerSpec", "ContainerSpec")
                        .WithMany("ServerInstances")
                        .HasForeignKey("ContainerSpecId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.McpServerTemplate", "McpServerTemplate")
                        .WithMany("ServerInstances")
                        .HasForeignKey("McpServerTemplateId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.User", "User")
                        .WithMany("ServerInstances")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ContainerSpec");

                    b.Navigation("McpServerTemplate");

                    b.Navigation("User");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ServerLog", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", "ServerInstance")
                        .WithMany("ServerLogs")
                        .HasForeignKey("ServerInstanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ServerInstance");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Subscription", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Plan", "Plan")
                        .WithMany("Subscriptions")
                        .HasForeignKey("PlanId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Plan");

                    b.Navigation("User");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Usage.Entities.RequestLog", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", "ServerInstance")
                        .WithMany()
                        .HasForeignKey("ServerInstanceId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Features.Usage.Entities.UserUsage", "UserUsage")
                        .WithMany("RequestLogs")
                        .HasForeignKey("UserUsageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ServerInstance");

                    b.Navigation("User");

                    b.Navigation("UserUsage");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Usage.Entities.UserUsage", b =>
                {
                    b.HasOne("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Subscription", "Subscription")
                        .WithMany("UsageRecords")
                        .HasForeignKey("SubscriptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("OnParDev.MyMcp.Api.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Subscription");

                    b.Navigation("User");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ContainerSpec", b =>
                {
                    b.Navigation("ServerInstances");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.McpServerTemplate", b =>
                {
                    b.Navigation("ServerInstances");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.ServerInstance", b =>
                {
                    b.Navigation("DeploymentAudits");

                    b.Navigation("ServerLogs");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Domain.Entities.User", b =>
                {
                    b.Navigation("ServerInstances");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Plan", b =>
                {
                    b.Navigation("Subscriptions");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Subscriptions.Entities.Subscription", b =>
                {
                    b.Navigation("UsageRecords");
                });

            modelBuilder.Entity("OnParDev.MyMcp.Api.Features.Usage.Entities.UserUsage", b =>
                {
                    b.Navigation("RequestLogs");
                });
#pragma warning restore 612, 618
        }
    }
}
