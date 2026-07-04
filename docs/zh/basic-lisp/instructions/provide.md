---
title: provide
---

# 类型

```scheme
(-> T void-t :content-type <type> :use-site <symbol>)
```

# 描述

向合并点写入值。`T` 与 `:content-type` 引用同一类型，`:use-site` 标识目标合并点。

# 例子

```scheme
(= ∅.1 void-t (provide result :content-type value-t :use-site result))
```
