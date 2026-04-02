# file

[builtin] file-read
[builtin] file-write & file-writeln
[builtin] file-print & file-println

# about path

path-base-name
path-directory-name

path-extension -- with dot
path-stem
path-full-extension
path-stem-full

path-absolute?
path-relative?

path-join
path-canonicalize

# about fs

fs-exists?
fs-file?
fs-directory?

fs-read
fs-write

fs-directory-contents
fs-directory-contents-recursive

fs-directory-entries -- with type info
fs-directory-entries-recursive

fs-make-directory

fs-delete-file
fs-delete-directory
fs-delete-recursive

fs-rename

# prelude

be able to use prelude module

# about file

[prelude] call-with-input-file
[prelude] call-with-output-file

# pass

[pass] `030-ExplicateControlPass` -- `toBasicExp` -- handle `Require` -- fix `require.test.meta`
