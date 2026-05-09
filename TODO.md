[meta-lisp.js] 在 `Type.ts` 中模仿 // TypeType 部分的代码，实现 AnyType。

- 并且，模仿 TypeType 的情况实现 format 相关的代码：

  src/meta/format/formatType.ts
  src/meta/format/formatTypeInMod.ts

[meta-lisp.js] add `any-t` to `builtinType`

[meta-lisp.js] [learn] learn about how to add `any-t`
[meta-lisp.js] add `any-t`
[meta-lisp.js] be clear about how to use untyped meta-lisp
[meta-lisp.js] `(define-data)` defines new value -- different from list and record

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
