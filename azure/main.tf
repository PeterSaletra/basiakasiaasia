terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.5"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  frontend_dist_dir = abspath("${path.module}/../frontend/dist")
  app_name          = "${var.app_name}-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 6
  upper   = false
  special = false
}

resource "azurerm_resource_group" "this" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "this" {
  name                = "${local.app_name}-plan"
  resource_group_name  = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  os_type             = "Linux"
  sku_name            = var.service_plan_sku
}

data "archive_file" "frontend" {
  type        = "zip"
  source_dir  = local.frontend_dist_dir
  output_path = "${path.module}/.terraform/${local.app_name}.zip"
}

resource "azurerm_linux_web_app" "this" {
  name                = local.app_name
  resource_group_name  = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.this.id

  site_config {
    always_on = true
    app_command_line = "pm2 serve /home/site/wwwroot --no-daemon --spa -p 8080"

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "20-lts"
    WEBSITES_PORT                = "8080"
    WEBSITE_RUN_FROM_PACKAGE     = "1"
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false"
  }

  zip_deploy_file = data.archive_file.frontend.output_path
}
