---
title: set-each
---

# 类型

```meta-lisp
(polymorphic (A Any) (-> (-> A Any) (set-t A) void-t))
```

# 描述

对集合中的每个元素执行副作用的函数。

# 例子

```meta-lisp
(set-each println (@set 1 2 3))
```
