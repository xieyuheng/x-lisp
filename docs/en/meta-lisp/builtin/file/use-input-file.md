---
title: use-input-file
---

# Type

```meta-lisp
(polymorphic (A)
  (-> text-t (-> file-t A) A))
```

# Description

Open file for reading, pass the file handle to a function, and automatically close the file when done.

# Examples

```meta-lisp
(use-input-file "data.txt"
  (lambda (file) (file-read file)))
```
