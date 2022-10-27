FROM alpine:3

WORKDIR /workspace

RUN apk add --update bash nodejs postgresql

ADD ./service.tgz /workspace/
ADD ./start-app.sh /workspace/

CMD ./start-app.sh
