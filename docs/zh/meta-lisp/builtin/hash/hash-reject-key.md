---
title: hash-reject-key
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (-> K bool-t) (hash-t K V) (hash-t K V)))
```

# 描述

移除键满足谓词的条目。

# 例子

```meta-lisp
(hash-reject-key
  int-is-non-negative
  (@hash 1 'a 2 'b -1 'x -2 'y))
;; => (@hash -1 'x -2 'y)
```
