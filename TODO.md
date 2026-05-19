[meta-lisp.meta] 补充 load-project.meta 文件中缺失的 load-builtin-mod 函数

- load-builtin-mod 函数放在 src/meta/project/load-builtin-mod.meta
- load-builtin-mod 从 [meta-lisp.js] 的 src/meta/project/loadBuiltinMod.ts 迁移而来。
  - 需要补充迁移在这个过程中遇到的任何依赖函数，比如
    - typeBuiltin
    - definePrimitiveFunction
    等等
    迁移过来的函数要放在 [meta-lisp.meta] 与 [meta-lisp.js] 对应的文件夹和文件中。
