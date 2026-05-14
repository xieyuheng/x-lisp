---
title: set-each
---

# 类型

```scheme
(polymorphic (A Any) (-> (-> A Any) (set-t A) void-t))
```

# 描述

对集合中的每个元素执行副作用的函数。派生函数。

# 例子

```scheme
(set-each println #{1 2 3})
```
