# Frontend
FROM node:22.13.1-alpine AS build

WORKDIR /resource-manager-frontend

COPY package.json ./

COPY package-lock.json ./

RUN npm ci --silent

COPY . ./

RUN npm run build

# Nginx
FROM nginx:stable-alpine

COPY --from=build /resource-manager-frontend/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]