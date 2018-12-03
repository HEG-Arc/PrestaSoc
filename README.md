# PrestaSoc

Calculateur de prestations sociales

[![Build Status](https://travis-ci.org/HEG-Arc/PrestaSoc.svg?branch=master)](https://travis-ci.org/HEG-Arc/PrestaSoc)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/27cba82baf3c4b749f532f28a715e7c8)](https://www.codacy.com/app/bfritscher/PrestaSoc?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=HEG-Arc/PrestaSoc&amp;utm_campaign=Badge_Grade)

## development information

Requires NodeJS > 6

`npm install`

`npm run serve` http://localhost:3000

`npm run simvars` see which variables are used in html compared to vars.fr.json

`npm run test:auto` run unit-test

### sending codecoverage to codacy

`npm install -g codacy-coverage`

`cat coverage\report.lcov | codacy-coverage -t token`
