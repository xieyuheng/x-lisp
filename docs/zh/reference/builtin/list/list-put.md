---
title: list-put
---

# 类型

```scheme
(polymorphic (E) (-> int-t E (list-t E) (list-t E)))
```

# 描述

按索引设置元素，返回新列表，原列表不变。

# 例子

```scheme
(list-put 0 10 [1 2 3])  ;; => [10 2 3]
(list-put 1 10 [1 2 3])  ;; => [1 10 3]
```
