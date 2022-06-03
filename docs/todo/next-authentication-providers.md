---
title: Adding Authentication Providers 
---

## Adding passport authentication providers

see [passportjs](https://www.passportjs.org/packages/)

```mermaid

sequenceDiagram

user ->> willdocs: GET:Login
willdocs ->> auth provider: get application redirect
auth provider ->> willdocs: auth-provider/redirect-url?apptoken
willdocs ->> user: redirect to auth-provider/redirect-url?apptoken
user ->> auth provider: please log me in
auth provider ->> user: redirect to willdocs/login?token
user --> willdocs: /login?token

```

