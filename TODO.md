把 [meta-lisp.js] 中的 stack/ 迁移到 [meta-lisp.meta] 中的 stack/

- 注意，相关的代码 fragment 要使用 (module stack) 来声明 module
- 你已经在 (module stack) 中了，不需要考虑和 (module meta) 中的名字冲突，
  所以大多数名字不需要 stack- 前缀。

把 [meta-lisp.js] 中的 basic/ 迁移到 [meta-lisp.meta] 中的 basic/

- 注意，相关的代码 fragment 要使用 (module basic) 来声明 module
- 你已经在 (module basic) 中了，不需要考虑和 (module meta) 中的名字冲突，
  所以大多数名字不需要 basic- 前缀。
