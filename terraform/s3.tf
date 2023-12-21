resource "aws_s3_bucket" "user_feedback_app" {
  bucket = var.bucket_name

  tags = {
    Name = "user-feedback-app-bucket"
  }
}

resource "aws_s3_bucket_acl" "user_feedback_app_acl" {
  bucket = aws_s3_bucket.user_feedback_app.id
  acl    = "private"
	depends_on = [aws_s3_bucket_ownership_controls.user_feedback_app_ownership_controls]
}

resource "aws_s3_bucket_ownership_controls" "user_feedback_app_ownership_controls" {
  bucket = aws_s3_bucket.user_feedback_app.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_versioning" "user_feedback_app_versioning" {
  bucket = aws_s3_bucket.user_feedback_app.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.user_feedback_app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
