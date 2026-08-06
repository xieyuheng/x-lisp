---
title: text-append
---

# 类型

```meta-lisp
(-> text-t text-t text-t)
```

# 描述

追加一个字符串，接在末尾。

# 例子

```meta-lisp
(text-append "hello" " world")  ;; => "hello world"
(text-append "a" "b")           ;; => "ab"
(text-append "" "hello")        ;; => "hello"
```
