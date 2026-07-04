---
title: set-member?
---

# 类型

```scheme
(polymorphic (E) (-> E (set-t E) bool-t))
```

# 描述

判断元素是否存在于集合中。

# 例子

```scheme
(set-member? 2 #{1 2 3})  ;; => true
(set-member? 0 #{1 2 3})  ;; => false
```
