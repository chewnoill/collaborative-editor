#!/bin/bash

echo $GCS_PRIVATE_KEY > gcs_user_content.json
export GCS_CREDS_FILE="/workspace/gcs_user_content.json"

cd packages/service

echo "starting application..."
node dist/bundle.js
