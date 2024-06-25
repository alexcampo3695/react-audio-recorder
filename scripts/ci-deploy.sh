#!/bin/bash
# Exit script when any command ran here returns with non-zero exit code
set -e

# Export COMMIT_SHA1 so it's available for envsubst
COMMIT_SHA1=$CIRCLE_SHA1
export COMMIT_SHA1

# Replace variables in the YAML files
envsubst < ./kube/app-manifests/client-deployment.yml > ./kube/app-manifests/client-deployment.yml.out
mv ./kube/app-manifests/client-deployment.yml.out ./kube/app-manifests/client-deployment.yml

envsubst < ./kube/app-manifests/server-deployment.yml > ./kube/app-manifests/server-deployment.yml.out
mv ./kube/app-manifests/server-deployment.yml.out ./kube/app-manifests/server-deployment.yml

# Decode the certificate
echo "$KUBERNETES_CERTIFICATE" | base64 --decode > cert.crt

# Apply the Kubernetes configurations
kubectl --kubeconfig=/dev/null --server=$KUBERNETES_SERVER --certificate-authority=cert.crt --token=$KUBERNETES_TOKEN apply --validate=false -f ./kube/app-manifests/

echo "Deployment completed successfully!"
