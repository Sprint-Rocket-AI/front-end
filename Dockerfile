FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_CHECKPOINT_API_URL=http://localhost:8082/api
ARG VITE_CHECKPOINT_WS_URL=ws://localhost:8082/ws/reminders?userId=dev-001
ARG VITE_COGNITO_AUTHORITY=https://cognito-idp.us-east-2.amazonaws.com/us-east-2_LvTgAG5Ke
ARG VITE_COGNITO_CLIENT_ID=43a8bmfjfvabop9im3tikd56lv
ARG VITE_COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net
ARG VITE_COGNITO_DOMAIN=https://workspace-duoc.auth.us-east-2.amazoncognito.com
ARG VITE_COGNITO_LOGOUT_URI=https://d84l1y8p4kdic.cloudfront.net

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
	VITE_CHECKPOINT_API_URL=$VITE_CHECKPOINT_API_URL \
	VITE_CHECKPOINT_WS_URL=$VITE_CHECKPOINT_WS_URL \
	VITE_COGNITO_AUTHORITY=$VITE_COGNITO_AUTHORITY \
	VITE_COGNITO_CLIENT_ID=$VITE_COGNITO_CLIENT_ID \
	VITE_COGNITO_REDIRECT_URI=$VITE_COGNITO_REDIRECT_URI \
	VITE_COGNITO_DOMAIN=$VITE_COGNITO_DOMAIN \
	VITE_COGNITO_LOGOUT_URI=$VITE_COGNITO_LOGOUT_URI

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]