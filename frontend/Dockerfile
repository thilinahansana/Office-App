FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

# `vite preview` serves the production build; fine for an internal LAN tool
# where we don't need a separate nginx layer.
CMD ["npm", "run", "preview"]
