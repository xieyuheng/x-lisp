---
title: call-with-input-file
---

# Type

```scheme
(polymorphic (A)
  (-> string-t (-> file-t A) A))
```

# Description

Open file for reading, pass the file handle to a function, and automatically close the file when done.

# Examples

```scheme
(call-with-input-file "data.txt"
  (lambda (file) (file-read file)))
```
