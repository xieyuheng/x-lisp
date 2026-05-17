[meta-lisp.js] 给 `ModFragment` 在 `serialNumber` 之外加上 `path`

- dump fragment 的时候，把 `path` 作为注释，写在 dump file 的开头。
  输出的时候，用 [helpers.js] 中的 pathRelativeToCwd 把 path 转化为相对 cwd 的路径。

[meta-builtin.meta] 我们的 builtin 中，现在缺少 [helpers.js] 的 `pathRelativeToCwd` 以及 nodejs 的 `Path.relative`

看一下我们现有的 path 相关的 builtin。
你有什么想法？
