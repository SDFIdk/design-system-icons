#!/bin/bash

# Generates a piece of HTML code that lists all the available icons

echo '<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-flow: row wrap; gap: 1rem;">' >> snippet.html

for i in ../icons/*.svg; do
  echo "<li><img class=\"ds-icon\" src=\"${i:3}\" alt=\"\"><p>${i:9}</p><code>&lt;img src=\"${i:3}\" alt=\"\"></code></li>" >> snippet.html
done

echo "</ul>" >> snippet.html
