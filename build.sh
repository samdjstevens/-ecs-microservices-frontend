#!/usr/bin/env bash

REGISTRY=public.ecr.aws/f0u6x9s9
IMAGE=$REGISTRY/ecs-microservices-frontend
TAG=latest

# build the dockerfile and tag
docker build -t $IMAGE:$TAG . && \

# push to ECR
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REGISTRY && \
docker push $IMAGE:$TAG