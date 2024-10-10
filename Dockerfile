FROM node:18
WORKDIR /app
ENV VITE_API_URL=https://op-back-end.onrender.com/items/
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","run","preview"]
