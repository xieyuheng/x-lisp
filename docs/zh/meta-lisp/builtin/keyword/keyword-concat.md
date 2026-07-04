---
title: keyword-concat
---

# 类型

```meta-lisp
(-> (list-t keyword-t) keyword-t)
```

# 描述

拼接一个关键字列表，生成一个新关键字。

# 例子

```meta-lisp
(keyword-concat [:foo :bar :baz])  ;; => ':foobarbaz
(keyword-concat [:a :b])           ;; => ':ab
```
