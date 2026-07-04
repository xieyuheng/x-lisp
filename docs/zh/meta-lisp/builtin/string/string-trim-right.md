---
title: string-trim-right
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

删除字符串右侧的空白字符。

# 例子

```meta-lisp
(string-trim-right "hello  ")  ;; => "hello"
(string-trim-right "  hello")  ;; => "  hello"
(string-trim-right "hello")    ;; => "hello"
```
