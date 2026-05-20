---
title: set-add!
---

# 类型

```scheme
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# 描述

向集合中添加元素，同 `set-add`。

# 例子

```scheme
(set-add! 4 #{1 2 3})  ;; => #{1 2 3 4}
```
