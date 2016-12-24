# Dockerfile to build app
FROM node:latest

COPY index.js package.json static /workspace/
COPY apps /workspace/apps/
WORKDIR /workspace

EXPOSE 8080
CMD ["npm", "start"]
