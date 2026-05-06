[meta-lisp.meta] `project-load-mod-fragments`

- 下面实现 `project-load-mod-fragments`。
- 可以参考 [meta-lisp.js] 中的 `projectLoadModFragments`。
- 注意 meta-lisp 与 typescript 的差异。
- 你可以且只可以用 meta-builtin.meta 中所声明过的 builtin 函数。
  比如 fs 相关的：
  ```scheme
  (claim fs-exists? (-> string-t bool-t))
  (claim fs-file? (-> string-t bool-t))
  (claim fs-directory? (-> string-t bool-t))
  (claim fs-read (-> string-t string-t))
  (claim fs-write (-> string-t string-t void-t))
  (claim fs-list (-> string-t (list-t string-t)))
  (claim fs-list-recursive (-> string-t (list-t string-t)))
  (claim fs-ensure-file (-> string-t void-t))
  (claim fs-ensure-directory (-> string-t void-t))
  (claim fs-delete-file (-> string-t void-t))
  (claim fs-delete-directory (-> string-t void-t))
  (claim fs-delete (-> string-t void-t))
  (claim fs-rename (-> string-t string-t void-t))
  ```
  和 path 相关的：
  ```scheme
  (claim path-base-name (-> string-t string-t))
  (claim path-directory-name (-> string-t string-t))
  (claim path-extension (-> string-t string-t))
  (claim path-stem (-> string-t string-t))
  (claim path-absolute? (-> string-t bool-t))
  (claim path-relative? (-> string-t bool-t))
  (claim path-join (-> string-t string-t string-t))
  (claim path-normalize (-> string-t string-t))
  ```
- 实现之后可以修复 `load-project` 中相关的注释。

[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function
