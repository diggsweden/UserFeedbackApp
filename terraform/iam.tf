# SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
#
# SPDX-License-Identifier: CC0-1.0

# Retrieve github-user as a resource
data "aws_iam_user" "user" {
  user_name = "github_user"
}

# Create the policy to access the S3 bucket
resource "aws_iam_policy" "github_ci_policy" {
  name        = "github-ci-policy"
  path        = "/"
  description = "Github CI policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ],
        Effect = "Allow",
        Resource = [
          "${aws_s3_bucket.user_feedback_app.arn}/*"
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.user_feedback_app.arn
        ]
      },
			{
        Sid = "VisualEditor0",
        Effect = "Allow",
        Action = "cloudfront:CreateInvalidation",
        Resource = [
					aws_cloudfront_distribution.user_feedback_app.arn
				]
      }
    ]
  })
}

# Attach the policy to our user
resource "aws_iam_policy_attachment" "github-ci-attachment" {
  name       = "github-ci-attachment"
  users      = [data.aws_iam_user.user.user_name]
  policy_arn = aws_iam_policy.github_ci_policy.arn
}
