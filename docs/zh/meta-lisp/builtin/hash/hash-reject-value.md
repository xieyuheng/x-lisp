---
title: hash-reject-value
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (-> V bool-t) (hash-t K V) (hash-t K V)))
```

# 描述

移除值满足谓词的条目。

# 例子

```meta-lisp
(hash-reject-value
  int-non-negative?
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'x -1 'y -2)
```
