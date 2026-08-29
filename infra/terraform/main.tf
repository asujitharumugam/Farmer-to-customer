# =========================================================
# Phase 26: Infrastructure as Code (IaC) Terraform Definition
# Krishi Bazaar - Cloud Infrastructure Provisioning (Azure / AWS)
# =========================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "rg-krishibazaar-tfstate"
    storage_account_name = "stkrishitfstate2026"
    container_name       = "tfstate"
    key                  = "krishi-bazaar.production.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
  }
}

# ---------------------------------------------------------
# Resource Group
# ---------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
  tags = {
    Environment = var.environment
    Project     = "Krishi Bazaar"
    ManagedBy   = "Terraform"
  }
}

# ---------------------------------------------------------
# Virtual Network & Subnets
# ---------------------------------------------------------
resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "aks_subnet" {
  name                 = "snet-aks"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/22"]
}

# ---------------------------------------------------------
# Azure Kubernetes Service (AKS) Orchestration Cluster
# ---------------------------------------------------------
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "k8s-${var.project_name}-${var.environment}"

  default_node_pool {
    name                = "agentpool"
    node_count          = var.aks_node_count
    vm_size             = "Standard_D2s_v5"
    vnet_subnet_id      = azurerm_subnet.aks_subnet.id
    enable_auto_scaling = true
    min_count           = 2
    max_count           = 10
    os_disk_size_gb     = 64
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }

  role_based_access_control_enabled = true

  tags = {
    Environment = var.environment
  }
}

# ---------------------------------------------------------
# Azure Container Registry (ACR)
# ---------------------------------------------------------
resource "azurerm_container_registry" "acr" {
  name                = "acrkrishibazaar${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = false
}

# Attach ACR to AKS
resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}

# ---------------------------------------------------------
# Azure Key Vault (Secrets Management)
# ---------------------------------------------------------
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                        = "kv-${var.project_name}-${var.environment}"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true
  sku_name                    = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Recover", "Backup", "Restore"
    ]
  }
}

# Store JWT Secret in Key Vault
resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = var.jwt_secret
  key_vault_id = azurerm_key_vault.kv.id
}
