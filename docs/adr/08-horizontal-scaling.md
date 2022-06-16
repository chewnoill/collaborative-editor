---
title: 8 - Horizontal Scaling with PM2
---

# Adding PM2

## Status
Complete

## Context

Horizontal Scaling for javascript is not automatic, but it is pretty plug-in-play with [pm2](https://www.npmjs.com/package/pm2).
Using more of the CPU will improve performance, without affecting price.

## Decision & Consequences

pm2 is being added on for the production build only, so it should not effect development directly.


:::warning

Seems like observability is getting pretty complicated. Might be time to add a log aggregator

:::
