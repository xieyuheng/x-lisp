---
title: sexp-t
---

# 类型

代数数据类型。表示带源码位置的 S 表达式。

# 变体

```scheme
(symbol-sexp  (content symbol-t)   (location source-location-t))
(keyword-sexp (content keyword-t)  (location source-location-t))
(string-sexp  (content string-t)   (location source-location-t))
(int-sexp     (content int-t)      (location source-location-t))
(float-sexp   (content float-t)    (location source-location-t))
(list-sexp    (elements (list-t sexp-t))
               (location source-location-t))
```

# 自动生成

每个变体会生成构造器、谓词、访问器和修改器。例如 `symbol-sexp`：

```scheme
(claim symbol-sexp  (-> symbol-t source-location-t sexp-t))
(claim symbol-sexp? (-> sexp-t bool-t))
(claim symbol-sexp-content  (-> sexp-t symbol-t))
(claim symbol-sexp-location (-> sexp-t source-location-t))
(claim symbol-sexp-put-content!  (-> symbol-t sexp-t sexp-t))
(claim symbol-sexp-put-location! (-> source-location-t sexp-t sexp-t))
```

其他变体类似。

# 例子

```scheme
(symbol-sexp 'foo (make-source-location "test" ...))
(int-sexp 42 (make-source-location "test" ...))
```
