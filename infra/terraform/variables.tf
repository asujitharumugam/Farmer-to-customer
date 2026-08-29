variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "krishibazaar"
}

variable "environment" {
  description = "Target environment (dev, qa, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure Cloud Region"
  type        = string
  default     = "eastus2"
}

variable "aks_node_count" {
  description = "Initial number of node pool instances"
  type        = number
  default     = 3
}

variable "jwt_secret" {
  description = "Production JWT Secret Key"
  type        = string
  sensitive   = true
}
