[stack-lisp.c] [refactor] gc_t

- gc_threshold 和 gc_prev_count 应该完全属于 vm_gc_maybe_collect 的逻辑，
  不应该保存在 gc_t 中。

- 在 vm_gc_maybe_collect 前面设置变量 gc_threshold。
  gc_prev_count 在 vm_gc_maybe_collect 中作为局部变量 before。

- 不要使用 size_t current 变量，就用 before 和 after

- move gc_t to gc.c

[meta-builtin.meta] 实现 path-resolve 把 relative path 根据 cwd 转化为 absolute path
[meta-builtin.meta] 改善 path-relative 和 path-relative-to-cwd
- 也许模仿 nodejs path.relative 的逻辑，自动 resolve relative path
[meta-lisp.meta] 迁移 [meta-lisp.js] 的 020-DesugarPass.ts 到 [meta-lisp.meta] 的 desugar-pass
