---
title: sexp-collect-key-value-pairs
---

# 类型

```meta-lisp
(-> (list-t sexp-t) (list-t (pair-t keyword-t sexp-t)))
```

# 描述

从带位置的 S 表达式列表中收集键值对。遇到 keyword 开头的 sexp 时，将 keyword 作为键、下一个 sexp 作为值。

# 例子

```meta-lisp
(sexp-collect-key-value-pairs
  [keyword-sexp :key ... int-sexp 42 ...])
;; => [(make-pair :key int-sexp-42)]
```
