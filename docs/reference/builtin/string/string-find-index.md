---
title: string-find-index
---

# 类型

```scheme
(-> string-t string-t int-t)
```

# 描述

查找子串在字符串中第一次出现的位置。不存在时返回 `-1`。

# 例子

```scheme
(string-find-index "hello" "ll")  ;; => 2
(string-find-index "hello" "x")   ;; => -1
(string-find-index "hello" "")    ;; => 0
```
