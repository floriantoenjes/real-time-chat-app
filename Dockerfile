FROM node:20

ARG VITE_PEERJS_SERVER_HOST
ARG VITE_PEERJS_SERVER_PORT
ARG VITE_TURN_SERVER_URL
ARG VITE_TURN_SERVER_USERNAME
ARG VITE_TURN_SERVER_PASSWORD

ENV VITE_PEERJS_SERVER_HOST=$VITE_PEERJS_SERVER_HOST
ENV VITE_PEERJS_SERVER_PORT=$VITE_PEERJS_SERVER_PORT
ENV VITE_TURN_SERVER_URL=$VITE_TURN_SERVER_URL
ENV VITE_TURN_SERVER_USERNAME=$VITE_TURN_SERVER_USERNAME
ENV VITE_TURN_SERVER_PASSWORD=$VITE_TURN_SERVER_PASSWORD

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

COPY --chown=node:node . .

RUN npm install
RUN npm run build

EXPOSE 4200

CMD [ "npm", "run", "start" ]
