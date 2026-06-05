---
title: for-set
---

# 类型

```scheme
(polymorphic (A Any) (-> (set-t A) (-> A Any) void-t))
```

# 描述

`for-set` 是 `set-each` 的 data-first 版本。
等价于 `(set-each fn data)`。

对集合中每个元素执行副作用函数。

# 例子

```scheme
(for-set (@set 1 2 3) println)
```
