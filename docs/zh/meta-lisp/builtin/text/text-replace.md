---
title: text-replace
---

# 类型

```meta-lisp
(-> text-t text-t text-t text-t)
```

# 描述

将字符串中所有出现的 `old` 替换为 `new`。

# 例子

```meta-lisp
(text-replace "hello world" "world" "there")  ;; => "hello there"
(text-replace "aaa" "a" "b")                  ;; => "bbb"
(text-replace "abc" "x" "y")                  ;; => "abc"
```
