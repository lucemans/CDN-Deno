FROM registry.lucemans.com/deno:latest
COPY src ./
CMD ["/bin/deno", "run", "--allow-net", "--allow-env", "--allow-read", "--unstable", "src/index.ts"]