---
title: error
---

# 类型

```scheme
(polymorphic (A B) (-> A B))
```

# 描述

抛出一个错误，以任意值作为错误信息。函数不会返回。

# 例子

```scheme
(error "something went wrong")
(error 42)
```
