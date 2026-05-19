[meta-lisp.meta] 补充 load-project.meta 文件中缺失的 load-builtin-mod 函数

- load-builtin-mod 函数放在 src/meta/project/load-builtin-mod.meta
- load-builtin-mod 从 [meta-lisp.js] 的 src/meta/project/loadBuiltinMod.ts 迁移而来。
  - 需要补充迁移在这个过程中遇到的任何依赖函数，比如
    - typeBuiltin
    - definePrimitiveFunction
    等等
    迁移过来的函数要放在 [meta-lisp.meta] 与 [meta-lisp.js] 对应的文件夹和文件中。

把 [meta-lisp.js] 中的 basic/ 迁移到 [meta-lisp.meta] 中的 basic/

- 注意，相关的代码 fragment 要使用 (module basic) 来声明 module
- 你已经在 (module basic) 中了，不需要考虑和 (module meta) 中的名字冲突，
  所以大多数名字不需要 basic- 前缀。
