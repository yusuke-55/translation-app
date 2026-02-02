FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Set default port
ENV PORT=3000

EXPOSE 3000

# Serve the built app
CMD serve -s dist -l ${PORT}
