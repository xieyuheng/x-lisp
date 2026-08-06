---
title: text-trim-start
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

删除字符串开头的空白字符，同 `text-trim-left`。

# 例子

```meta-lisp
(text-trim-start "  hello")  ;; => "hello"
(text-trim-start "hello  ")  ;; => "hello  "
```
