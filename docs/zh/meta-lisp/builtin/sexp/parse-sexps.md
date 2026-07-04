---
title: parse-sexps
---

# 类型

```scheme
(-> string-t string-t (list-t sexp-t))
```

# 描述

解析字符串为带源码位置的 S 表达式列表。第一个参数是文件名，第二个参数是源码内容。

# 例子

```scheme
(parse-sexps "test" "(a b c)")
;; => [(list-sexp [symbol-sexp a ...] ...)]
```
