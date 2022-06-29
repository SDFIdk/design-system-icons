#!/usr/bin/env bash

# Copies files to a given location

echo "Copying icon and logo SVGs to /assets/icons and /assets/logos"

if ! [ -d "$( pwd; )/../../assets" ]
then
  mkdir $( pwd; )/../../assets

  if ! [ -d "$( pwd; )/../../assets/icons" ]
  then
    mkdir $( pwd; )/../../assets/icons
  fi

fi

cp $( pwd; )/icons/*.svg $( pwd; )/assets/icons/

if ! [ -d "$( pwd; )/../../assets/logos" ]
then
  mkdir $( pwd; )/../../assets/logos
fi


cp $( pwd; )/logos/*.svg $( pwd; )/../../assets/logos/

echo "Done copying"