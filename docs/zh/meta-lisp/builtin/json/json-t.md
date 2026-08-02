---
title: json-t
---

# 类型

```meta-lisp
type-t
```

# 描述

JSON 值类型。表示解析后的 JSON 值。

# 定义

```meta-lisp
(define-enum json-t
  (json-null)
  (json-bool    (value bool-t))
  (json-number  (value float-t))
  (json-string  (value string-t))
  (json-array   (elements (list-t json-t)))
  (json-object  (entries (hash-t string-t json-t))))
```

# 自动生成

```meta-lisp
(claim json-null  (-> json-t))
(claim is-json-null (-> json-t bool-t))

(claim json-bool          (-> bool-t json-t))
(claim is-json-bool         (-> json-t bool-t))
(claim json-bool-value    (-> json-t bool-t))
(claim json-bool-put-value (-> bool-t json-t json-t))

(claim json-number          (-> float-t json-t))
(claim is-json-number         (-> json-t bool-t))
(claim json-number-value    (-> json-t float-t))
(claim json-number-put-value (-> float-t json-t json-t))

(claim json-string          (-> string-t json-t))
(claim is-json-string         (-> json-t bool-t))
(claim json-string-value    (-> json-t string-t))
(claim json-string-put-value (-> string-t json-t json-t))

(claim json-array              (-> (list-t json-t) json-t))
(claim is-json-array             (-> json-t bool-t))
(claim json-array-elements     (-> json-t (list-t json-t)))
(claim json-array-put-elements (-> (list-t json-t) json-t json-t))

(claim json-object              (-> (hash-t string-t json-t) json-t))
(claim is-json-object             (-> json-t bool-t))
(claim json-object-entries      (-> json-t (hash-t string-t json-t)))
(claim json-object-put-entries (-> (hash-t string-t json-t) json-t json-t))
```

# 例子

```meta-lisp
(json-null)
(json-bool true)
(json-number 42.0)
(json-string "hello")
(json-array [(json-number 1.0) (json-number 2.0)])
(json-object (@hash "x" (json-number 1.0)))
```
