---
title: for-list-index
---

# 类型

```scheme
(polymorphic (A Any) (-> (list-t A) (-> int-t A Any) void-t))
```

# 描述

`for-list-index` 是 `list-each-index` 的 data-first 版本。
等价于 `(list-each-index fn data)`。

对列表中每个元素执行带索引的副作用函数。

# 例子

```scheme
(for-list-index ['a 'b 'c]
  (lambda (i x)
    (println i)
    (println x)))
```
