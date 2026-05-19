variable "location" {
  description = "Azure region for the deployment."
  type        = string
  default     = "westeurope"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group."
  type        = string
  default     = "rg-frontend"
}

variable "app_name" {
  description = "Base name for the App Service web app."
  type        = string
  default     = "basiakasiaasia"
}

variable "service_plan_sku" {
  description = "App Service plan SKU."
  type        = string
  default     = "B1"
}
