#!/usr/bin/env bash

# Copies files

echo "Copying icon and logo SVGs to $INIT_CWD/assets + $( pwd )"

if ! [ -d "$INIT_CWD/assets" ]
then
  mkdir $INIT_CWD/assets

  if ! [ -d "$INIT_CWD/assets/icons" ]
  then
    mkdir $INIT_CWD/assets/icons
  fi

fi

cp $( pwd )/icons/*.svg $INIT_CWD/assets/icons/

if ! [ -d "$INIT_CWD/assets/logos" ]
then
  mkdir $INIT_CWD/assets/logos
fi

cp $( pwd )/logos/*.svg $INIT_CWD/assets/logos/

echo "Done copying"