{
  description = "BasiaAsiaKasia";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        myShell = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
          ];

          shellHook = ''
            if [ ! -d node_modules ]; then
              echo "Installing npm dependencies..."
              npm install
            fi
          '';
        };
      in
      {
        devShells.default = myShell;
      }
    );
}
