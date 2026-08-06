---
title: text-lines
---

# 类型

```meta-lisp
(-> text-t (list-t text-t))
```

# 描述

按换行符将字符串拆分为多行。

# 例子

```meta-lisp
(text-lines "a\nb\nc")  ;; => ["a" "b" "c"]
(text-lines "abc")      ;; => ["abc"]
(text-lines "")         ;; => [""]
```
