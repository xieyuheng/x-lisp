# ppml.js

PPML -- pretty print markup language.

Pretty printing is like how HTML works:

- HTML: first describe the layout, then render in different screens.
- PPML: first describe the layout, then format with different widths.

## Example

```xml
<concat>
  <text>begin</text>
  <indent 3>
    <br/>
    <group>
      <text>stmt</text>
      <br/>
      <text>stmt</text>
      <br/>
      <text>stmt</text>
    </group>
  </indent>
  <br/>
  <text>end</text>
</concat>
```

- `<indent n>` -- increase current indentation by `n` space.
- `<br />` -- print differently by mode:
  - in `inline` mode -- print a space,
  - in `block` mode -- print newline and the current indentation.
- `<group>` -- try to print in `inline` mode,
  if can not fit in the given width,
  print in `block` mode.

Of course, we write XML in JavaScript:

```typescript
import { test } from "node:test"
import * as Ppml from "./index.ts"

const exampleNode = Ppml.concat(
  Ppml.text("begin"),
  Ppml.indent(
    3,
    Ppml.br(),
    Ppml.group(
      Ppml.text("stmt"),
      Ppml.br(),
      Ppml.text("stmt"),
      Ppml.br(),
      Ppml.text("stmt"),
    ),
  ),
  Ppml.br(),
  Ppml.text("end"),
)

test("ppml", () => {
  const widths = [30, 20, 10]
  for (const width of widths) {
    console.log(`${"-".repeat(width)}|${width}`)
    console.log(Ppml.format(width, exampleNode))
  }
})
```

Output:

```
------------------------------|30
begin stmt stmt stmt end
--------------------|20
begin
   stmt stmt stmt
end
----------|10
begin
   stmt
   stmt
   stmt
end
```

# Reference

- "Strictly Pretty", Christian Lindig, 2000
