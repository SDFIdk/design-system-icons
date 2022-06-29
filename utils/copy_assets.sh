#!/usr/bin/env bash

# Copies files to a given location

echo "Copying icon and logo SVGs to $INIT_CWD/assets"

$IMG_DIR=pwd

cd $INIT_CWD

if ! [ -d "assets" ]
then
  mkdir assets

  if ! [ -d "assets/icons" ]
  then
    mkdir assets/icons
  fi

fi

cp $IMG_DIR/icons/*.svg assets/icons/

if ! [ -d "assets/logos" ]
then
  mkdir assets/logos
fi


cp $IMG_DIR/logos/*.svg cd assets/logos/

echo "Done copying"