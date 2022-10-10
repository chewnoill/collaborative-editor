FROM alpine:3

WORKDIR /workspace

RUN apk add curl
RUN curl -fsSL -o /bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
RUN chmod +x /bin/dbmate

ADD . /workspace/

CMD dbmate up
