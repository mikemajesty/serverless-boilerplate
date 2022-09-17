aws --endpoint-url=http://0.0.0.0:4566 sqs get-queue-attributes --queue-url http://0.0.0.0:4566/000000000000/serverless-sqs --attribute-names All

aws --endpoint-url=http://0.0.0.0:4566 sns create-topic --name order-creation-events --region us-east-1
 --profile test-profile --output 
 
aws --endpoint-url=http://0.0.0.0:4566 sqs create-queue --queue-name dummy-queue --profile=default --region us-east-1

aws --endpoint-url=http://0.0.0.0:4566 sns subscribe --topic-arn   arn:aws:sns:us-east-1:000000000000:order-creation-events --profile=default  --protocol sqs --notification-endpoint http://0.0.0.0:4566/000000000000/dummy-queue