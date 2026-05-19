{
  description = "Ażur";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  outputs =
    { nixpkgs, ... }:
    {
      devShells.x86_64-linux =
        let
          pkgs = import nixpkgs {
            system = "x86_64-linux";
            config.allowUnfree = true;
          };

          update-app = pkgs.writeShellScriptBin "update-app" ''
            #!/usr/bin/env bash
            set -euo pipefail

            REPO_ROOT=$(git rev-parse --show-toplevel)
            AZURE_DIR="$REPO_ROOT/azure"
            FRONTEND_DIR="$REPO_ROOT/frontend"
            FRONTEND_ZIP="$FRONTEND_DIR/frontend.zip"

            ${pkgs.nodejs}/bin/npm --prefix "$FRONTEND_DIR" run build
            rm -f "$FRONTEND_ZIP"
            (cd "$FRONTEND_DIR/dist" && zip -qr "$FRONTEND_ZIP" .)

            RESOURCE_GROUP_NAME="$(terraform -chdir="$AZURE_DIR" output -raw resource_group_name)"
            WEB_APP_NAME="$(terraform -chdir="$AZURE_DIR" output -raw web_app_name)"

            az webapp deploy \
              --resource-group "$RESOURCE_GROUP_NAME" \
              --name "$WEB_APP_NAME" \
              --src-path "$FRONTEND_ZIP" \
              --type zip
          '';

          myShell = pkgs.mkShell {
            packages =
              with pkgs;
              [
                azure-cli
                terraform
                nodejs
              ]
              ++ [ update-app ];
          };
        in
        {
          default = myShell;
        };
    };
}
