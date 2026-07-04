---
title: string-starts-with?
---

# 类型

```meta-lisp
(-> string-t string-t bool-t)
```

# 描述

判断字符串是否以指定前缀开头。

# 例子

```meta-lisp
(string-starts-with? "hello" "he")  ;; => true
(string-starts-with? "hello" "hi")  ;; => false
(string-starts-with? "hello" "")    ;; => true
```
