#!/bin/sh

set -e

# Check for the node executable
if ! [ -x "$(command -v node)" ]; then
  # If not present install
  # This is specific to ubuntu
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

npm install
npm run build
exec npm start
