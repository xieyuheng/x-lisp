---
title: set-empty?
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) bool-t))
```

# 描述

判断集合是否为空。

# 例子

```scheme
(set-empty? #{})       ;; => true
(set-empty? #{1 2 3})  ;; => false
```
