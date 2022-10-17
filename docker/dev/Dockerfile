FROM alpine:3

RUN apk add --update curl bash nodejs npm postgresql

RUN npm install -g yarn

RUN curl -fsSL -o /bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
RUN chmod +x /bin/dbmate

WORKDIR /workspace
