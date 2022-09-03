FROM node:14.20.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g serverless
RUN npm install serverless-offline

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "yarn", "debug", "--host", "0.0.0.0" ]