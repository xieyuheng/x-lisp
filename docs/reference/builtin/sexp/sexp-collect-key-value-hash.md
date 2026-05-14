---
title: sexp-collect-key-value-hash
---

# 类型

```scheme
(-> (list-t located-sexp-t) (hash-t keyword-t located-sexp-t))
```

# 描述

从带位置的 S 表达式列表中收集键值对为哈希表。与 `sexp-collect-key-value-pairs` 类似，但返回哈希表。派生函数。

# 例子

```scheme
(sexp-collect-key-value-hash
  [keyword-sexp :key ... int-sexp 42 ...])
;; => @{:key int-sexp-42}
```
