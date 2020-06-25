#!/bin/sh
docker build --rm -t registry.lucemans.com/cdn-deno .
# docker run -it -p 8000:8000 registry.lucemans.com/cdn-deno