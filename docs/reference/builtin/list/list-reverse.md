---
title: list-reverse
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# 描述

反转列表。

# 例子

```scheme
(list-reverse [1 2 3])  ;; => [3 2 1]
(list-reverse [])       ;; => []
```
