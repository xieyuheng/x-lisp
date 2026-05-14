---
title: pair-put-second!
---

# 类型

```scheme
(polymorphic (A B) (-> B (pair-t A B) (pair-t A B)))
```

# 描述

替换 pair 的第二个元素。

# 例子

```scheme
(pair-put-second! "world" (make-pair 1 "hello"))  ;; => (1 . "world")
```
