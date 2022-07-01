---
title: Document History
labels:
- todo
---

# What is document history?

Documents are a collection of inserts, and deletes, collected in some order.
This set of changes is what we call the document history, and this is also how
documents are constructed, at the end of the history you can look at the document
and see what it is.

# How can document history be visualized?

The primary usecase for text editing CRDTs are general single character inserts and
modifications. This causes a problem for visualization, since it is unlikely that
a document split out one symbol at a time will be useful.

Grouping changes by author and time slice, for example, could be useful:

```pg
select
    to_timestamp(
      extract('epoch' from created_at)::int / 60 * 60
    ) as timeslice,
    user_id
from document_updates_queue
group by timeslice, user_id;
```

# Where should document history be located?

For now, we can place a link to get to the history page in the `DocumentMenu`
which will link the user to `/documents/[id]/history` which will contain the history
for the selected document.

import DocumentMenuWithHistory from './document-menu-w-history.png';

<img src={DocumentMenuWithHistory}/>


# What does document histroy look like?



From user: Will on July 1st, 2022

```diff
@@ -0,0 +1 @@
+hello world
+
```

From anonymous - July 1st, 2022

```diff
@@ -0,0 +1 @@
-hello world
+In the beginning...

```