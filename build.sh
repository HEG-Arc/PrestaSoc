#!/bin/sh
docker run -v `pwd`/dist:/usr/src/app/dist -v `pwd`/src:/usr/src/app/src heg-arc/jestime npm run clean
docker run -v `pwd`/dist:/usr/src/app/dist -v `pwd`/src:/usr/src/app/src heg-arc/jestime npm run build