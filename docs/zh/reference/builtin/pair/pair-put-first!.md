---
title: pair-put-first!
---

# 类型

```scheme
(polymorphic (A B) (-> A (pair-t A B) (pair-t A B)))
```

# 描述

替换 pair 的第一个元素。

# 例子

```scheme
(pair-put-first! 7 (make-pair 1 "hello"))  ;; => (7 . "hello")
```
