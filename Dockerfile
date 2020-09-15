FROM node:12.18.3

EXPOSE 8080

ENV PORT 8080

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install --no-optional --production && \
    npm cache clean --force

COPY . .

CMD [ "npm", "start" ]
