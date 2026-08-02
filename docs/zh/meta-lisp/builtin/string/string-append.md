---
title: string-append
---

# 类型

```meta-lisp
(-> string-t string-t string-t)
```

# 描述

追加一个字符串，接在末尾。

# 例子

```meta-lisp
(string-append "hello" " world")  ;; => "hello world"
(string-append "a" "b")           ;; => "ab"
(string-append "" "hello")        ;; => "hello"
```
