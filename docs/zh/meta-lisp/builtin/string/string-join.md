---
title: string-join
---

# 类型

```meta-lisp
(-> string-t (list-t string-t) string-t)
```

# 描述

用分隔符连接字符串列表，是 `string-split` 的逆操作。

# 例子

```meta-lisp
(string-join "," ["a" "b" "c"])  ;; => "a,b,c"
(string-join " " ["a" "b"])      ;; => "a b"
(string-join "" ["a" "b"])       ;; => "ab"
```
