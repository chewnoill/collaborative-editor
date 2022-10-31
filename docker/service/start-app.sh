#!/bin/bash
set -e

echo $GCS_PRIVATE_KEY | base64 --decode > gcs_user_content.json
export GCS_CREDS_FILE="/workspace/gcs_user_content.json"

cd packages/service

echo "starting application..."
node dist/bundle.js
