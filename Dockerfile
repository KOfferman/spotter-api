FROM node:alpine3.18
WORKDIR /app
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose port 443 to the outside world
EXPOSE 443

# Command to run the development server
CMD ["npm","run","start"]
