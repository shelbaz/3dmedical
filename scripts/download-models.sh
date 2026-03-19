#!/bin/sh
# Downloads and optimizes 3D anatomical models from Sketchfab
# Requires: SKETCHFAB_TOKEN environment variable
# Usage: SKETCHFAB_TOKEN=your_token ./scripts/download-models.sh

set -e

TOKEN="${SKETCHFAB_TOKEN:-9bd6d9afdfb649139b6bf0f9e995ebf6}"
OUTDIR="public/models"
TMPDIR=$(mktemp -d)

mkdir -p "$OUTDIR"

download_model() {
  local uid="$1" name="$2"
  echo "Downloading: $name..."

  # Get temp download URL
  local response=$(curl -s "https://api.sketchfab.com/v3/models/$uid/download" -H "Authorization: Token $TOKEN")
  local url=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['gltf']['url'])")

  # Download and extract
  curl -sL "$url" -o "$TMPDIR/${name}.zip"
  mkdir -p "$TMPDIR/${name}"
  cd "$TMPDIR/${name}" && unzip -qo "$TMPDIR/${name}.zip"

  # Optimize with Draco + WebP textures
  npx gltf-transform optimize "$TMPDIR/${name}/scene.gltf" "$OUTDIR/${name}.glb" \
    --compress draco --texture-compress webp --texture-size 512

  echo "  Done: $OUTDIR/${name}.glb ($(du -h "$OUTDIR/${name}.glb" | cut -f1))"
}

download_model "0ba41334eb384f5b999d7469f906d3ae" "female-reproductive-urinary"

# Cleanup
rm -rf "$TMPDIR"
echo "All models downloaded and optimized."
