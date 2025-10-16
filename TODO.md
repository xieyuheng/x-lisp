[digraph] digraph-add-edge!
[digraph] digraph-has-edge?
[digraph] digraph-add-edges!

[digraph] digraph-edges
[digraph] digraph-edge-count

[digraph] digraph-direct-predecessors
[digraph] digraph-direct-successors

[digraph] digraph-delete-edge!
[digraph] digraph-delete-vertex!

[digraph] make-digraph

[digraph] digraph-direct-successor?
[digraph] digraph-direct-predecessor?

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
