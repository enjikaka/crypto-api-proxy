FROM hayd/deno:alpine-1.6.0

EXPOSE 5000
WORKDIR /app
USER deno

ADD . /app

CMD ["run", "--allow-net", "--allow-read", "index.ts"]
