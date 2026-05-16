[meta-lisp.js] [refactor] Env 需要有自己的 API，内部的实现方式不透明，不能直接操作和创建 Map。

- 具体 API 设计模仿 Ctx

[meta-lisp.js] [refactor] formatValue 在 下面这两种情况，应该打印更多的信息

CurryValue 应该 直接打印 部分 apply 的形状。

    case "CurryValue": {
      return `{CurryValue}`
    }

DefinitionValue 应该打印 Definition 的名字

    case "DefinitionValue": {
      return `{DefinitionValue}`
    }


# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
