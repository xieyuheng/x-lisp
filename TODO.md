[greph] graph-has-vertex?
[greph] graph-delete-vertex!

[greph] graph-has-edge?
[greph] graph-delete-edge!

[digraph] digraph?
[digraph] make-digraph
[digraph] make-empty-digraph
[digraph] digraph-edge?

[digraph] digraph-edges
[digraph] digraph-vertices

[digraph] digraph-edge-count
[digraph] digraph-vertex-count
[digraph] digraph-empty?

[digraph] digraph-direct-predecessors
[digraph] digraph-direct-successors

[digraph] digraph-add-vertex!
[digraph] digraph-has-vertex?
[digraph] digraph-add-vertices!
[digraph] digraph-delete-vertex!

[digraph] digraph-add-edge!
[digraph] digraph-has-edge?
[digraph] digraph-delete-edge!
[digraph] digraph-add-edges!

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
