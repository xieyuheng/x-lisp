---
title: schemaless datomic
date: 2026-04-13
---

[basic-lisp.c] design a database to store metadata:

- (add e a v)
- (delete e a v)
- (delete-attribute e a)
- (delete-entity e)
- (put e a v) -- (delete-attribute e a) + (add e a v)

```scheme
(db-transect (test)
  (put test :test/name 'test-suite/bool-test)
  (put test :test/status 'running))

(db-let ((test :test/name 'test-suite/bool-test))
  (put test :test/status 'finished))
```
