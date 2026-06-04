---
title: list-each
---

# 类型

```scheme
(polymorphic (A Any) (-> (-> A Any) (list-t A) void-t))
```

# 描述

对列表中的每个元素执行副作用的函数。

# 例子

```scheme
(list-each println [1 2 3])
;; 输出：
;; 1
;; 2
;; 3
```
