FROM node:6
COPY .babelrc /usr/src/app/
COPY package.json /usr/src/app/
COPY gulpfile.js /usr/src/app/
COPY gulp_tasks/ /usr/src/app/gulp_tasks/
COPY conf/ /usr/src/app/conf/
COPY loaders/ /usr/src/app/loaders/
WORKDIR /usr/src/app/
RUN npm install && npm cache clean