# # pull official base image
FROM node:13.12.0-alpine as build

# # set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

RUN npm run build

FROM nginx:stable-alpine
COPY ./ssl/ethisim1.pem /etc/nginx/certs/ethisim1.pem
COPY ./ssl/common.key /etc/nginx/certs/common.key
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
