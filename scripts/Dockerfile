FROM node:23-slim

RUN apt-get update && apt-get install -y \
    openssl \
    openjdk-17-jdk && rm -rf /var/lib/apt/lists/*

RUN npm install -g grpc-tools grpc_tools_node_protoc_ts

RUN keytool --help && grpc_tools_node_protoc --version

WORKDIR /app

CMD ["bash"]