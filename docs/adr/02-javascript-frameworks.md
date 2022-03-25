# Javascript Frameworks

## Status
Accepted

## Context

For node stacks, the most popular web framework is express. 

## Decision and Consequences

The following application dependencies will be adopted.

[express](https://www.npmjs.com/package/express) manages handling network requests.

[passport](https://www.npmjs.com/package/passport)
manages an authentication for incoming requests, works well with express. 

[postgraphile](https://www.npmjs.com/package/postgraphile) manages introspecting a postgres database, and serving it as a graphql api.

[apollo-client](https://www.npmjs.com/package/apollo-client) client that can make gql queries.

[next](https://www.npmjs.com/package/next) javascript static site generator.

