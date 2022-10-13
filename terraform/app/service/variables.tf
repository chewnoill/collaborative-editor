variable "image" {
    default = "us-east1-docker.pkg.dev/willdocs-1/docker-repo/service:latest"
    description = "docker image to deploy"
}
variable "email" {
    description = "email of service account to use"
}
variable "name" {
    default = "willdocs-service"
    description = "name of service to use"
}
variable "region" {
    default = "us-east1"
    description = "region to deploy to"
}
variable "vpc_id" {
    description = "vpc id"
}
variable "project_name"{
    default = "willdocs-1"
}
variable "policy"{
    type = string
}
