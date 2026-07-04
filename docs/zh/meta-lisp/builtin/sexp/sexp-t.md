---
title: sexp-t
---

# 类型

```meta-lisp
type-t
```

# 描述

带位置的 S 表达式类型。表示解析后的 S 表达式及其源码位置。

# 定义

```meta-lisp
(define-enum sexp-t
  (symbol-sexp  (content symbol-t)            (location source-location-t))
  (keyword-sexp (content keyword-t)           (location source-location-t))
  (string-sexp  (content string-t)            (location source-location-t))
  (int-sexp     (content int-t)               (location source-location-t))
  (float-sexp   (content float-t)             (location source-location-t))
  (list-sexp    (elements (list-t sexp-t))
                (location source-location-t)))
```

# 自动生成

```meta-lisp
(claim symbol-sexp  (-> symbol-t source-location-t sexp-t))
(claim symbol-sexp? (-> sexp-t bool-t))
(claim symbol-sexp-content  (-> sexp-t symbol-t))
(claim symbol-sexp-location (-> sexp-t source-location-t))
(claim symbol-sexp-put-content!  (-> symbol-t sexp-t sexp-t))
(claim symbol-sexp-put-location! (-> source-location-t sexp-t sexp-t))

(claim keyword-sexp  (-> keyword-t source-location-t sexp-t))
(claim keyword-sexp? (-> sexp-t bool-t))
(claim keyword-sexp-content  (-> sexp-t keyword-t))
(claim keyword-sexp-location (-> sexp-t source-location-t))
(claim keyword-sexp-put-content!  (-> keyword-t sexp-t sexp-t))
(claim keyword-sexp-put-location! (-> source-location-t sexp-t sexp-t))

(claim string-sexp  (-> string-t source-location-t sexp-t))
(claim string-sexp? (-> sexp-t bool-t))
(claim string-sexp-content  (-> sexp-t string-t))
(claim string-sexp-location (-> sexp-t source-location-t))
(claim string-sexp-put-content!  (-> string-t sexp-t sexp-t))
(claim string-sexp-put-location! (-> source-location-t sexp-t sexp-t))

(claim int-sexp  (-> int-t source-location-t sexp-t))
(claim int-sexp? (-> sexp-t bool-t))
(claim int-sexp-content  (-> sexp-t int-t))
(claim int-sexp-location (-> sexp-t source-location-t))
(claim int-sexp-put-content!  (-> int-t sexp-t sexp-t))
(claim int-sexp-put-location! (-> source-location-t sexp-t sexp-t))

(claim float-sexp  (-> float-t source-location-t sexp-t))
(claim float-sexp? (-> sexp-t bool-t))
(claim float-sexp-content  (-> sexp-t float-t))
(claim float-sexp-location (-> sexp-t source-location-t))
(claim float-sexp-put-content!  (-> float-t sexp-t sexp-t))
(claim float-sexp-put-location! (-> source-location-t sexp-t sexp-t))

(claim list-sexp  (-> (list-t sexp-t) source-location-t sexp-t))
(claim list-sexp? (-> sexp-t bool-t))
(claim list-sexp-elements  (-> sexp-t (list-t sexp-t)))
(claim list-sexp-location (-> sexp-t source-location-t))
(claim list-sexp-put-elements!  (-> (list-t sexp-t) sexp-t sexp-t))
(claim list-sexp-put-location! (-> source-location-t sexp-t sexp-t))
```

# 例子

```meta-lisp
(symbol-sexp 'foo (make-source-location "test" ...))
(int-sexp 42 (make-source-location "test" ...))
```
