variable "bucket_name" {
  type        = string
  default     = "user-feedback-app-bucket"
  description = "The name of the bucket, e.g. 'user-feedback-app-bucket'"
}

variable "aws_region" {
  type        = string
  default     = "eu-north-1"
  description = "The AWS region, e.g. 'eu-north-1'"
}

variable "aws_profile" {
  type        = string
  default     = ""
  description = "The AWS profile, e.g. 'default'"
}

variable "domain" {
  type        = string
  default     = ""
  description = "The domain name, e.g. 'example.com'"
}
