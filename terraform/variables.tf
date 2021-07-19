variable "project_name" {
  type = string
  description = "Project name"
  default     = "willdocs-1"
}

variable "dns_name" {
  type = string
  description = "dns name"
  default = "bingobongo.ml"
}

variable "private_gcs_bucket_name" {
  type = string
  description = "preexisting protected bucket, used to host service bundles"
  default = "willdocs-1"
}
variable "public_gcs_bucket_name" {
  type = string
  description = "preexisting public bucket, used to serve static content"
  default = "willdocs-2"
}