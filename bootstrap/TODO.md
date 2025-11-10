instruction database

use a general typed document database

```typescript
const InstrDb = defineDatabase({
  <table-name>: defineTable({
    <attribute>: <schema>,
    ...
  }),
  ...
})

InstrDb.<table-name>.get(<opcode>)
```

# machine

[machine] setup

[machine] `Operand` -- support `Label`
[machine] `instr` -- totally generic

[machine] `Mod`
[machine] `Block`
[machine] `Definition` & `FunctionDefinition`
[machine] `Stmt`
[machine] `load`
[machine] `parse`
[machine] `format` & `pretty`
[machine] `formatToX86Gas`

# compiler

[compiler] `compileToX86Assembly`
