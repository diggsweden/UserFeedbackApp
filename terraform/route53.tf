locals {
	subdomain = "user-feedback-app"
}

data "aws_route53_zone" "route53_zone" {
  name         = var.domain
  private_zone = false
}

resource "aws_route53_record" "cf_dns" {
  zone_id = data.aws_route53_zone.route53_zone.zone_id
  name    = "${local.subdomain}.${var.domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.user_feedback_app.domain_name
    zone_id                = aws_cloudfront_distribution.user_feedback_app.hosted_zone_id
    evaluate_target_health = false
  }
}
