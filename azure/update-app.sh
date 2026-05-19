#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
AZURE_DIR="$SCRIPT_DIR"
FRONTEND_ZIP="$FRONTEND_DIR/frontend.zip"

npm --prefix "$FRONTEND_DIR" run build
rm -f "$FRONTEND_ZIP"
(cd "$FRONTEND_DIR/dist" && zip -qr "$FRONTEND_ZIP" .)

RESOURCE_GROUP_NAME="$(terraform -chdir="$AZURE_DIR" output -raw resource_group_name)"
WEB_APP_NAME="$(terraform -chdir="$AZURE_DIR" output -raw web_app_name)"

az webapp deploy \
  --resource-group "$RESOURCE_GROUP_NAME" \
  --name "$WEB_APP_NAME" \
  --src-path "$FRONTEND_ZIP" \
  --type zip
