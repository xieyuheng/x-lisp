---
title: text-starts-with
---

# 类型

```meta-lisp
(-> text-t text-t bool-t)
```

# 描述

判断字符串是否以指定前缀开头。

# 例子

```meta-lisp
(text-starts-with "hello" "he")  ;; => true
(text-starts-with "hello" "hi")  ;; => false
(text-starts-with "hello" "")    ;; => true
```
