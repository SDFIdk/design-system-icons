#!/usr/bin/env bash

# Copies files to a given location

echo "Installing design-system-icons will copy icon files to your project."
echo "Choose a directory for the icons [/assets/icons]:"
read DIR
echo "You picked $DIR"

if [$DIR != ""]
then
  echo "Copying files to $DIR"
  cp icons/*.svg $DIR
else
  echo "Copying files to /assets/icons"
  mkdir mytemp
  cp icons/*.svg mytemp/
fi
