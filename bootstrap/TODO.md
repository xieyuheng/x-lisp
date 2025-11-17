[machine] `value` -- `encodeInt`

[machine] `value` -- `tags`

```
    X_INT         = 0b000,
    X_FLOAT       = 0b001,
    X_LITTLE      = 0b010,
    X_ADDRESS     = 0b011,
    //            = 0b100,
    //            = 0b101,
    //            = 0b110,
    X_OBJECT      = 0b111,
```

[basic] `010-SelectInstructionPass` -- `onInstr` -- fix tagged value encoding

[machine] `070-AssignHomePass`
[machine] `080-PatchInstructionPass`
[machine] `090-PrologAndEpilogPass`
