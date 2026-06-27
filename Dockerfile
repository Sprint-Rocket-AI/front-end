FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=https://rwf5nicdif.execute-api.us-east-1.amazonaws.com/prod
ARG VITE_CHECKPOINT_API_URL=http://localhost:8082/api
ARG VITE_CHECKPOINT_WS_URL=ws://localhost:8082/ws/reminders?userId=dev-001
ARG VITE_COGNITO_AUTHORITY=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Ul4uQi42G
ARG VITE_COGNITO_CLIENT_ID=425er5pq3u4ehpk6rlrcnkkbiq
ARG VITE_COGNITO_REDIRECT_URI=https://front-end-vjhf.onrender.com/home
ARG VITE_COGNITO_DOMAIN=https://us-east-1ul4uqi42g.auth.us-east-1.amazoncognito.com
ARG VITE_COGNITO_LOGOUT_URI=https://us-east-1ul4uqi42g.auth.us-east-1.amazoncognito.com/logout?client_id=425er5pq3u4ehpk6rlrcnkkbiq&logout_uri=https://front-end-vjhf.onrender.com/home

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