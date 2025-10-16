[digraph] digraph-has-edge?
[digraph] digraph-add-edges!

[digraph] make-digraph

[digraph] digraph-direct-successor?
[digraph] digraph-direct-predecessor?

[digraph] digraph-edges
[digraph] digraph-edge-count

[digraph] digraph-delete-edge!
[digraph] digraph-delete-vertex!

[digraph] digraph-successor?
[digraph] digraph-predecessor?

[digraph] digraph-in-degree
[digraph] digraph-out-degree

# basic

[basic] `Stmt` -- `Define` -- only define function
[basic] `Stmt` -- `Import`
[basic] `Instr` -- including label
[basic] `Operand` -- `Label` -- symbol start with `.` -- `.label`
[basic] `Operand` -- `Var` -- can local name or function name
[basic] `Mod` -- need bundler before codegen
