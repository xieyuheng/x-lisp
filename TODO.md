

[meta-builtin.meta]

[meta-builtin.meta] 实现 path-resolve 把 relative path 根据 cwd 转化为 absolute path
[meta-builtin.meta] 改善 path-relative 和 path-relative-to-cwd
- 也许模仿 nodejs path.relative 的逻辑，自动 resolve relative path
[meta-lisp.meta] 迁移 [meta-lisp.js] 的 020-DesugarPass.ts 到 [meta-lisp.meta] 的 desugar-pass
