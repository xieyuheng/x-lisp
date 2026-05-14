---
title: symbol?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为符号。

# 例子

```scheme
(symbol? 'foo)    ;; => true
(symbol? "foo")   ;; => false
(symbol? 42)      ;; => false
```
