#!/bin/bash

# Clear Kubernetes resources
NAMESPACE="carevoice-prod"
kubectl delete all --all -n $NAMESPACE
kubectl delete namespace $NAMESPACE

# Clear Docker resources
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)

echo "Kubernetes and Docker cleanup completed successfully."
