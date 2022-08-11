variable "project_name" {
  type = string
  description = "Project name"
  default     = "willdocs-1"
}

variable "redis_url" {
  type = string
  description = "redis url"
}

variable "NEW_RELIC_ACCOUNT_ID" {
  type = string
  description = "NR Account ID"
}

variable "NEW_RELIC_API_KEY" {
  type = string
  description = "NR API key"
}

variable "build_number" {
  type        = number
  description = "build number"
}

output "build_number" {
  value = var.build_number
}
