---
title: text-join
---

# 类型

```meta-lisp
(-> text-t (list-t text-t) text-t)
```

# 描述

用分隔符连接字符串列表，是 `text-split` 的逆操作。

# 例子

```meta-lisp
(text-join "," ["a" "b" "c"])  ;; => "a,b,c"
(text-join " " ["a" "b"])      ;; => "a b"
(text-join "" ["a" "b"])       ;; => "ab"
```
