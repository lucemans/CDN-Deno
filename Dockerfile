FROM registry.lucemans.com/deno:latest
COPY run.sh .
COPY src src
CMD ["sh", "./run.sh"]