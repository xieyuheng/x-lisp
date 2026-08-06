---
title: text-find-index
---

# 类型

```meta-lisp
(-> text-t text-t int-t)
```

# 描述

查找子串在字符串中第一次出现的位置。不存在时返回 `-1`。

# 例子

```meta-lisp
(text-find-index "hello" "ll")  ;; => 2
(text-find-index "hello" "x")   ;; => -1
(text-find-index "hello" "")    ;; => 0
```
