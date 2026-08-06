---
title: text-trim-left
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

删除字符串左侧的空白字符。

# 例子

```meta-lisp
(text-trim-left "  hello")  ;; => "hello"
(text-trim-left "hello  ")  ;; => "hello  "
(text-trim-left "hello")    ;; => "hello"
```
