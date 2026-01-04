# ppml.js

PPML -- pretty print markup language.

Pretty printing is like how HTML works:

- HTML: first describe the layout, then render in different screens.
- PPML: first describe the layout, then print (format) with different widths.

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

The context of printing include _widths_, _indentation_ and _grouping mode_.

- `<indent n>` -- increase current indentation by `n` spaces.
- `<br />` -- print differently by current grouping mode.
  - in `Inline` mode -- just print a space,
  - in `Block` mode -- print a newline and the current indentation.
- `<group>` -- try to print in `Inline` mode first,
  if fail (can not fitin the given width),
  print in `Block` mode.

Of course, when programming, we write XML in JavaScript:

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
