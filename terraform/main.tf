# SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
#
# SPDX-License-Identifier: CC0-1.0

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~>3.27"
    }
  }

  required_version = ">=0.14.9"

}

provider "aws" {
  region  = var.aws_region
	profile = var.aws_profile
}

data "aws_iam_policy_document" "react_app_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.user_feedback_app.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "react_app_bucket_policy" {
  bucket = aws_s3_bucket.user_feedback_app.id
  policy = data.aws_iam_policy_document.react_app_s3_policy.json
}
