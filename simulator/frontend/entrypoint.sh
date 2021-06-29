#!/bin/sh

npm install --silent
npm install react-scripts@3.4.1 -g --silent

# # add app
# COPY . ./

REACT_APP_URL=https://ethisim1.cs.umass.edu  REACT_APP_APIKEY=${API_TOKEN} npm run build