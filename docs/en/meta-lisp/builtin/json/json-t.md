---
title: json-t
---

# Type

```meta-lisp
type-t
```

# Description

JSON value type. Represents a parsed JSON value.

# Definition

```meta-lisp
(define-enum json-t
  (null-json)
  (bool-json    (value bool-t))
  (number-json  (value float-t))
  (string-json  (value string-t))
  (array-json   (elements (list-t json-t)))
  (object-json  (entries (hash-t string-t json-t))))
```

# Generated

```meta-lisp
(claim null-json  (-> json-t))
(claim is-null-json (-> json-t bool-t))

(claim bool-json          (-> bool-t json-t))
(claim is-bool-json         (-> json-t bool-t))
(claim bool-json-value    (-> json-t bool-t))
(claim bool-json-put-value (-> bool-t json-t json-t))

(claim number-json          (-> float-t json-t))
(claim is-number-json         (-> json-t bool-t))
(claim number-json-value    (-> json-t float-t))
(claim number-json-put-value (-> float-t json-t json-t))

(claim string-json          (-> string-t json-t))
(claim is-string-json         (-> json-t bool-t))
(claim string-json-value    (-> json-t string-t))
(claim string-json-put-value (-> string-t json-t json-t))

(claim array-json              (-> (list-t json-t) json-t))
(claim is-array-json             (-> json-t bool-t))
(claim array-json-elements     (-> json-t (list-t json-t)))
(claim array-json-put-elements (-> (list-t json-t) json-t json-t))

(claim object-json              (-> (hash-t string-t json-t) json-t))
(claim is-object-json             (-> json-t bool-t))
(claim object-json-entries      (-> json-t (hash-t string-t json-t)))
(claim object-json-put-entries (-> (hash-t string-t json-t) json-t json-t))
```

# Examples

```meta-lisp
(null-json)
(bool-json true)
(number-json 42.0)
(string-json "hello")
(array-json [(number-json 1.0) (number-json 2.0)])
(object-json (@hash "x" (number-json 1.0)))
```
