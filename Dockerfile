FROM hayd/deno:alpine-1.3.3

EXPOSE 5000
WORKDIR /app
USER deno

COPY mod.ts /app
RUN deno cache mod.ts

ADD . /app
RUN deno cache index.ts

CMD ["run", "--allow-net", "--allow-read", "index.ts"]
