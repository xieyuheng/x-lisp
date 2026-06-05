---
title: for-list
---

# 类型

```scheme
(polymorphic (A Any) (-> (list-t A) (-> A Any) void-t))
```

# 描述

`for-list` 是 `list-each` 的 data-first 版本。
等价于 `(list-each fn data)`。

对列表中每个元素执行副作用函数。

# 例子

```scheme
(for-list [1 2 3] println)
```
