#!/usr/bin/env bash

# Copies files to a given location

echo "Copying icon and logo SVGs to /assets/icons and /assets/logos to $INIT_CWD/assets"

cd $INIT_CWD

if ! [ -d "assets" ]
then
  mkdir assets

  if ! [ -d "assets/icons" ]
  then
    mkdir assets/icons
  fi

fi

cp $( pwd; )/icons/*.svg assets/icons/

if ! [ -d "assets/logos" ]
then
  mkdir assets/logos
fi


cp $( pwd; )/logos/*.svg cd assets/logos/

echo "Done copying"