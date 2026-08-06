---
title: text-trim-right
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

删除字符串右侧的空白字符。

# 例子

```meta-lisp
(text-trim-right "hello  ")  ;; => "hello"
(text-trim-right "  hello")  ;; => "  hello"
(text-trim-right "hello")    ;; => "hello"
```
