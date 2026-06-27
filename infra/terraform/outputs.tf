output "cloudfront_url" {
  description = "프론트엔드 접속 URL"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "s3_bucket_name" {
  description = "S3 버킷 이름 (파일 업로드 시 사용)"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront 배포 ID (캐시 무효화 시 사용)"
  value       = aws_cloudfront_distribution.frontend.id
}
