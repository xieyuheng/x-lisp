---
title: Builtin Functions Index
---

# Builtin Functions Index

All builtin functions in meta-lisp, categorized by functionality.

- [Generic](#generic)
- [Boolean](#boolean)
- [Integer](#integer)
- [Float](#float)
- [String](#string)
- [Symbol](#symbol)
- [Keyword](#keyword)
- [Void](#void)
- [List](#list)
- [Set](#set)
- [Hash table](#hash-table)
- [Pair](#pair)
- [Maybe](#maybe)
- [Box](#box)
- [Function operations](#function-operations)
- [for- Iteration](#for-iteration)
- [File I/O](#file-io)
- [Path operations](#path-operations)
- [Assertions](#assertions)
- [Error handling](#error-handling)
- [Process](#process)
- [Random](#random)
- [Format](#format)
- [S-expression](#s-expression)
- [JSON](#json)

## Generic

Operations applicable to all types.

- [`is-atom`](value/is-atom.md) — Check if a value is an atom
- [`same`](value/same.md) — Atom or reference equality
- [`equal`](value/equal.md) — Structural equality
- [`format`](value/format.md) — Format any value as a string
- [`hash-code`](value/hash-code.md) — Compute hash code
- [`total-compare`](value/total-compare.md) — Total order comparison

## Boolean

Operations on `bool-t`.

- [`is-bool`](bool/is-bool.md) — Check if a value is a boolean
- [`not`](bool/not.md) — Logical not

## Integer

Operations on `int-t`.

### Type check

- [`is-int`](int/is-int.md) — Check if a value is an integer

### Arithmetic

- [`ineg`](int/ineg.md) — Negation
- [`iadd`](int/iadd.md) — Addition
- [`isub`](int/isub.md) — Subtraction
- [`imul`](int/imul.md) — Multiplication
- [`idiv`](int/idiv.md) — Integer division
- [`imod`](int/imod.md) — Modulo

### Predicates

- [`int-is-positive`](int/int-is-positive.md) — Check if positive
- [`int-is-non-negative`](int/int-is-non-negative.md) — Check if non-negative
- [`int-is-non-zero`](int/int-is-non-zero.md) — Check if non-zero

### Comparisons

- [`int-less`](int/int-less.md) — Less than
- [`int-greater`](int/int-greater.md) — Greater than
- [`int-less-or-equal`](int/int-less-or-equal.md) — Less than or equal
- [`int-greater-or-equal`](int/int-greater-or-equal.md) — Greater than or equal
- [`int-compare-ascending`](int/int-compare-ascending.md) — Ascending comparison function
- [`int-compare-descending`](int/int-compare-descending.md) — Descending comparison function

### Extremum

- [`int-min`](int/int-min.md) — Smaller of two values
- [`int-max`](int/int-max.md) — Larger of two values

### Derived

- [`int-sum`](int/int-sum.md) — Sum of a list
- [`int-product`](int/int-product.md) — Product of a list
- [`int-align`](int/int-align.md) — Align to a multiple

## Float

Operations on `float-t`.

### Type check

- [`is-float`](float/is-float.md) — Check if a value is a float

### Arithmetic

- [`fneg`](float/fneg.md) — Negation
- [`fadd`](float/fadd.md) — Addition
- [`fsub`](float/fsub.md) — Subtraction
- [`fmul`](float/fmul.md) — Multiplication
- [`fdiv`](float/fdiv.md) — Division
- [`fmod`](float/fmod.md) — Modulo

### Predicates

- [`float-is-positive`](float/float-is-positive.md) — Check if positive
- [`float-is-non-negative`](float/float-is-non-negative.md) — Check if non-negative
- [`float-is-non-zero`](float/float-is-non-zero.md) — Check if non-zero

### Comparisons

- [`float-less`](float/float-less.md) — Less than
- [`float-greater`](float/float-greater.md) — Greater than
- [`float-less-or-equal`](float/float-less-or-equal.md) — Less than or equal
- [`float-greater-or-equal`](float/float-greater-or-equal.md) — Greater than or equal
- [`float-compare-ascending`](float/float-compare-ascending.md) — Ascending comparison function
- [`float-compare-descending`](float/float-compare-descending.md) — Descending comparison function

### Extremum

- [`float-min`](float/float-min.md) — Smaller of two values
- [`float-max`](float/float-max.md) — Larger of two values

### Derived

- [`float-sum`](float/float-sum.md) — Sum of a list
- [`float-product`](float/float-product.md) — Product of a list

## String

Operations on `string-t`.

### Type checks

- [`is-string`](string/is-string.md) — Check if a value is a string
- [`string-is-int`](string/string-is-int.md) — Check if string is integer format
- [`string-is-float`](string/string-is-float.md) — Check if string is float format

### Basics

- [`string-length`](string/string-length.md) — Length
- [`string-is-empty`](string/string-is-empty.md) — Check if empty
- [`string-is-blank`](string/string-is-blank.md) — Check if blank

### Concatenation and splitting

- [`string-append`](string/string-append.md) — Append two strings
- [`string-concat`](string/string-concat.md) — Concatenate a list of strings
- [`string-substring`](string/string-substring.md) — Extract substring
- [`string-split`](string/string-split.md) — Split by delimiter
- [`string-join`](string/string-join.md) — Join with delimiter

### Search and replace

- [`string-starts-with`](string/string-starts-with.md) — Check prefix
- [`string-ends-with`](string/string-ends-with.md) — Check suffix
- [`string-contains`](string/string-contains.md) — Check if contains substring
- [`string-find-index`](string/string-find-index.md) — Find substring position
- [`string-replace`](string/string-replace.md) — Replace substring

### Trimming

- [`string-trim`](string/string-trim.md) — Trim both ends
- [`string-trim-start`](string/string-trim-start.md) — Trim start
- [`string-trim-end`](string/string-trim-end.md) — Trim end
- [`string-trim-left`](string/string-trim-left.md) — Trim left
- [`string-trim-right`](string/string-trim-right.md) — Trim right

### Case conversion

- [`string-to-lower-case`](string/string-to-lower-case.md) — Convert to lower case
- [`string-to-upper-case`](string/string-to-upper-case.md) — Convert to upper case

### Type conversion

- [`string-to-int`](string/string-to-int.md) — Parse string to integer
- [`string-to-float`](string/string-to-float.md) — Parse string to float
- [`string-to-symbol`](string/string-to-symbol.md) — Convert string to symbol

### Characters and code points

- [`string-chars`](string/string-chars.md) — Split into character list
- [`string-get-code-point`](string/string-get-code-point.md) — Get code point
- [`string-lines`](string/string-lines.md) — Split into lines

### Derived

- [`string-repeat`](string/string-repeat.md) — Repeat a string
- [`string-compare-lexical`](string/string-compare-lexical.md) — Lexicographic comparison

## Symbol

Operations on `symbol-t`.

- [`is-symbol`](symbol/is-symbol.md) — Check if a value is a symbol
- [`symbol-length`](symbol/symbol-length.md) — Length of symbol name
- [`symbol-append`](symbol/symbol-append.md) — Append two symbols
- [`symbol-concat`](symbol/symbol-concat.md) — Concatenate a list of symbols
- [`symbol-to-string`](symbol/symbol-to-string.md) — Convert to string

## Keyword

Operations on `keyword-t`.

- [`is-keyword`](keyword/is-keyword.md) — Check if a value is a keyword
- [`keyword-length`](keyword/keyword-length.md) — Length of keyword name
- [`keyword-append`](keyword/keyword-append.md) — Append two keywords
- [`keyword-concat`](keyword/keyword-concat.md) — Concatenate a list of keywords
- [`keyword-to-string`](keyword/keyword-to-string.md) — Convert to string

## Void

- [`is-void`](void/is-void.md) — Check if a value is void

## List

Operations on `(list-t E)`.

### Type and construction

- [`list-t`](list/list-t.md) — List type constructor
- [`make-list`](list/make-list.md) — Create an empty list
- [`is-list`](list/is-list.md) — Check if a value is a list
- [`cons`](list/cons.md) — Prepend an element

### Access

- [`car`](list/car.md) — First element
- [`cdr`](list/cdr.md) — Rest of the list
- [`list-head`](list/list-head.md) — First element (same as `car`)
- [`list-rest`](list/list-rest.md) — Rest of the list (same as `cdr`)
- [`list-first`](list/list-first.md) — First element
- [`list-second`](list/list-second.md) — Second element
- [`list-third`](list/list-third.md) — Third element
- [`list-last`](list/list-last.md) — Last element
- [`list-but-last`](list/list-but-last.md) — All but last element
- [`list-get`](list/list-get.md) — Get element by index

### Info

- [`list-length`](list/list-length.md) — List length
- [`list-is-empty`](list/list-is-empty.md) — Check if empty
- [`list-member`](list/list-member.md) — Check if contains element

### Mutation

- [`list-copy`](list/list-copy.md) — Copy a list
- [`list-put`](list/list-put.md) — Replace at index (mutable)
- [`list-copy-put`](list/list-copy-put.md) — Replace at index (immutable)
- [`list-push`](list/list-push.md) — Append at end (mutable)
- [`list-push-front`](list/list-push-front.md) — Prepend at front (mutable)
- [`list-pop`](list/list-pop.md) — Pop from end (mutable)
- [`list-pop-front`](list/list-pop-front.md) — Pop from front (mutable)

### Transformation

- [`list-copy-reverse`](list/list-copy-reverse.md) — Reverse
- [`list-to-set`](list/list-to-set.md) — Convert to set

### Generation

- [`list-range`](list/list-range.md) — Generate integers from 0 to n - 1
- [`list-enumerate`](list/list-enumerate.md) — Pair elements with indices

### Sort

- [`list-sort`](list/list-sort.md) — Sort in-place with comparator
- [`list-copy-sort`](list/list-copy-sort.md) — Sort with comparator (immutable)

### Iteration and mapping

- [`list-each`](list/list-each.md) — Iterate with side effects
- [`list-each-index`](list/list-each-index.md) — Iterate with index
- [`list-map-concat`](list/list-map-concat.md) — Map and flatten
- [`list-map-index-concat`](list/list-map-index-concat.md) — Map with index and flatten
- [`list-map`](list/list-map.md) — Map over elements
- [`list-map-index`](list/list-map-index.md) — Map with index
- [`list-zip-map`](list/list-zip-map.md) — Map over two lists in parallel
- [`list-zip`](list/list-zip.md) — Pair elements by position
- [`list-unzip`](list/list-unzip.md) — Unzip pairs
- [`list-select`](list/list-select.md) — Filter (keep matching)
- [`list-reject`](list/list-reject.md) — Opposite of filter (remove matching)

### Folding

- [`list-fold-left`](list/list-fold-left.md) — Left fold
- [`list-fold-left-index`](list/list-fold-left-index.md) — Left fold with index
- [`list-fold-right`](list/list-fold-right.md) — Right fold
- [`list-fold-right-index`](list/list-fold-right-index.md) — Right fold with index

### Quantification

- [`list-every`](list/list-every.md) — All elements satisfy predicate
- [`list-some`](list/list-some.md) — Some element satisfies predicate

### Sublists

- [`list-take`](list/list-take.md) — Take first n
- [`list-drop`](list/list-drop.md) — Drop first n
- [`list-append`](list/list-append.md) — Append two lists
- [`list-concat`](list/list-concat.md) — Concatenate list of lists

### Grouping and search

- [`list-group`](list/list-group.md) — Group by predicate
- [`list-find`](list/list-find.md) — Find first matching element
- [`list-find-index`](list/list-find-index.md) — Find first matching index

## Set

Operations on `(set-t E)`.

### Type and construction

- [`set-t`](set/set-t.md) — Set type constructor
- [`make-set`](set/make-set.md) — Create set from a list

### Info

- [`set-size`](set/set-size.md) — Set size
- [`set-is-empty`](set/set-is-empty.md) — Check if empty
- [`set-member`](set/set-member.md) — Check if contains element
- [`set-subset`](set/set-subset.md) — Check if subset

### Mutation

- [`set-copy`](set/set-copy.md) — Copy a set
- [`set-add`](set/set-add.md) — Add element (mutable)
- [`set-copy-add`](set/set-copy-add.md) — Add element (immutable)
- [`set-delete`](set/set-delete.md) — Delete element (mutable)
- [`set-copy-delete`](set/set-copy-delete.md) — Delete element (immutable)
- [`set-clear`](set/set-clear.md) — Clear set (mutable)

### Set operations

- [`set-union`](set/set-union.md) — Union
- [`set-inter`](set/set-inter.md) — Intersection
- [`set-difference`](set/set-difference.md) — Difference
- [`set-disjoint`](set/set-disjoint.md) — Check if disjoint

### Iteration and transformation

- [`set-each`](set/set-each.md) — Iterate with side effects
- [`set-every`](set/set-every.md) — All elements satisfy predicate
- [`set-some`](set/set-some.md) — Some element satisfies predicate
- [`set-map`](set/set-map.md) — Map over elements
- [`set-select`](set/set-select.md) — Filter
- [`set-reject`](set/set-reject.md) — Opposite of filter
- [`set-to-list`](set/set-to-list.md) — Convert to list

## Hash table

Operations on `(hash-t K V)`.

### Type and construction

- [`hash-t`](hash/hash-t.md) — Hash table type constructor
- [`make-hash`](hash/make-hash.md) — Create empty hash table
- [`make-hash-from-entries`](hash/make-hash-from-entries.md) — Build hash from pair list

### Info

- [`hash-is-empty`](hash/hash-is-empty.md) — Check if empty
- [`hash-length`](hash/hash-length.md) — Entry count
- [`hash-has`](hash/hash-has.md) — Check if contains key

### Access

- [`hash-get`](hash/hash-get.md) — Get value by key
- [`hash-get-maybe`](hash/hash-get-maybe.md) — Get value as maybe

### Conversion

- [`hash-keys`](hash/hash-keys.md) — Get key list
- [`hash-values`](hash/hash-values.md) — Get value list
- [`hash-entries`](hash/hash-entries.md) — Get entry list

### Mutation

- [`hash-put`](hash/hash-put.md) — Add key-value pair (mutable)
- [`hash-copy-put`](hash/hash-copy-put.md) — Add key-value pair (immutable)
- [`hash-put-entries`](hash/hash-put-entries.md) — Put entries (mutable)
- [`hash-copy-put-entries`](hash/hash-copy-put-entries.md) — Put entries (immutable)
- [`hash-delete`](hash/hash-delete.md) — Delete by key (mutable)
- [`hash-copy`](hash/hash-copy.md) — Copy hash table

### Iteration

- [`hash-each`](hash/hash-each.md) — Iterate over key-value pairs
- [`hash-each-key`](hash/hash-each-key.md) — Iterate over keys
- [`hash-each-value`](hash/hash-each-value.md) — Iterate over values
- [`hash-each-entry`](hash/hash-each-entry.md) — Iterate over entries

### Mapping

- [`hash-map`](hash/hash-map.md) — Map over key-value pairs
- [`hash-map-key`](hash/hash-map-key.md) — Map over keys
- [`hash-map-value`](hash/hash-map-value.md) — Map over values
- [`hash-map-entry`](hash/hash-map-entry.md) — Map over entries

### Selection

- [`hash-select`](hash/hash-select.md) — Filter by key-value predicate
- [`hash-select-key`](hash/hash-select-key.md) — Filter by key predicate
- [`hash-select-value`](hash/hash-select-value.md) — Filter by value predicate
- [`hash-reject`](hash/hash-reject.md) — Remove by key-value predicate
- [`hash-reject-key`](hash/hash-reject-key.md) — Remove by key predicate
- [`hash-reject-value`](hash/hash-reject-value.md) — Remove by value predicate

### Aggregation

- [`hash-append`](hash/hash-append.md) — Merge two hash tables
- [`hash-invert`](hash/hash-invert.md) — Swap keys and values
- [`hash-invert-group`](hash/hash-invert-group.md) — Invert with value grouping

## Pair

Operations on `(pair-t A B)`.

- [`pair-t`](pair/pair-t.md) — Pair type constructor
- [`make-pair`](pair/make-pair.md) — Construct a pair
- [`pair-first`](pair/pair-first.md) — First element
- [`pair-second`](pair/pair-second.md) — Second element
- [`pair-put-first`](pair/pair-put-first.md) — Replace first element
- [`pair-put-second`](pair/pair-put-second.md) — Replace second element

## Maybe

Operations on `(maybe-t A)`.

- [`maybe-t`](maybe/maybe-t.md) — Maybe type constructor
- [`just`](maybe/just.md) — Construct a present value
- [`nothing`](maybe/nothing.md) — Represent a missing value
- [`is-just`](maybe/is-just.md) — Check if just
- [`is-nothing`](maybe/is-nothing.md) — Check if nothing
- [`just-value`](maybe/just-value.md) — Extract value from just
- [`just-put-value`](maybe/just-put-value.md) — Replace value in just

## Box

Operations on the opaque type `(box-t E)`.

- [`box-t`](box/box-t.md) — Box type constructor
- [`make-box`](box/make-box.md) — Create an empty box
- [`box-is-empty`](box/box-is-empty.md) — Check if empty
- [`box-put`](box/box-put.md) — Store a value
- [`box-get-maybe`](box/box-get-maybe.md) — Get value as maybe
- [`box-get`](box/box-get.md) — Get value (error if empty)

## Function operations

Higher-order function manipulation.

- [`constant`](function/constant.md) — Return first argument
- [`identity`](function/identity.md) — Return argument unchanged
- [`ignore`](function/ignore.md) — Discard return value
- [`swap`](function/swap.md) — Swap function arguments
- [`drop`](function/drop.md) — Ignore first argument
- [`dup`](function/dup.md) — Duplicate argument

## for- Iteration

Data-first versions of `list-each` / `set-each` / `hash-each`.
Parameter order is `(data fn)`, semantically identical to the corresponding `-each` function.

- [`for-list`](for/for-list.md)
- [`for-list-index`](for/for-list-index.md)
- [`for-set`](for/for-set.md)
- [`for-hash`](for/for-hash.md)
- [`for-hash-value`](for/for-hash-value.md)
- [`for-hash-key`](for/for-hash-key.md)
- [`for-hash-entry`](for/for-hash-entry.md)

## File I/O

File handle read/write operations.

### Type

- [`file-t`](file/file-t.md) — File handle type

### Open and close

- [`open-input-file`](file/open-input-file.md) — Open file for reading
- [`open-output-file`](file/open-output-file.md) — Open file for writing
- [`file-close`](file/file-close.md) — Close file

### Read and write

- [`file-read`](file/file-read.md) — Read entire file
- [`file-write`](file/file-write.md) — Write a string
- [`file-writeln`](file/file-writeln.md) — Write a string with newline

### Convenience

- [`use-input-file`](file/use-input-file.md) — Auto-closing read
- [`use-output-file`](file/use-output-file.md) — Auto-closing write

### Standard output

- [`print`](file/print.md) — Print any value
- [`println`](file/println.md) — Print any value with newline

## Path operations

Path string manipulation and file system functions.

- [`path-file-name`](path/path-file-name.md) — Get file name
- [`path-directory-name`](path/path-directory-name.md) — Get directory name
- [`path-extension`](path/path-extension.md) — Get file extension
- [`path-stem`](path/path-stem.md) — Get file stem
- [`path-is-absolute`](path/path-is-absolute.md) — Check if absolute
- [`path-is-relative`](path/path-is-relative.md) — Check if relative
- [`path-join`](path/path-join.md) — Join paths
- [`path-normalize`](path/path-normalize.md) — Normalize path
- [`path-relative`](path/path-relative.md) — Compute relative path
- [`path-relative-to-cwd`](path/path-relative-to-cwd.md) — Relative to current working directory
- [`path-resolve`](path/path-resolve.md) — Resolve to absolute path

### Query

- [`path-exists`](path/path-exists.md) — Check if path exists
- [`path-is-file`](path/path-is-file.md) — Check if path is a file
- [`path-is-directory`](path/path-is-directory.md) — Check if path is a directory

### Read and write

- [`path-read`](path/path-read.md) — Read file
- [`path-write`](path/path-write.md) — Write file

### Directory operations

- [`path-list`](path/path-list.md) — List directory contents
- [`path-list-recursive`](path/path-list-recursive.md) — List directory recursively
- [`path-ensure-file`](path/path-ensure-file.md) — Ensure file exists
- [`path-ensure-directory`](path/path-ensure-directory.md) — Ensure directory exists

### Delete and rename

- [`path-delete-file`](path/path-delete-file.md) — Delete file
- [`path-delete-directory`](path/path-delete-directory.md) — Delete empty directory
- [`path-delete`](path/path-delete.md) — Delete recursively
- [`path-rename`](path/path-rename.md) — Rename

## Assertions

Assertion functions for testing.

- [`assert`](assert/assert.md) — Assert condition is true
- [`assert-not`](assert/assert-not.md) — Assert condition is false
- [`assert-equal`](assert/assert-equal.md) — Assert two values are equal
- [`assert-not-equal`](assert/assert-not-equal.md) — Assert two values are not equal

## Error handling

- [`error`](error/error.md) — Throw an error

## Process

- [`exit`](process/exit.md) — Exit with a code
- [`current-directory`](process/current-directory.md) — Get current directory
- [`current-command-line`](process/current-command-line.md) — Get command line after `--`
- [`current-full-command-line`](process/current-full-command-line.md) — Get full command line
- [`current-stdout-file`](process/current-stdout-file.md) — Get current stdout file handle
- [`current-stderr-file`](process/current-stderr-file.md) — Get current stderr file handle

## Random

- [`random-int`](random/random-int.md) — Random integer
- [`random-float`](random/random-float.md) — Random float

## Format

Type-specific S-expression formatting functions.

- [`format-as-sexp`](format/format-as-sexp.md) — Format an arbitrary value as an S-expression
- [`format-int`](format/format-int.md) — Format an integer
- [`format-float`](format/format-float.md) — Format a float
- [`format-keyword`](format/format-keyword.md) — Format a keyword
- [`format-symbol`](format/format-symbol.md) — Format a symbol
- [`format-bool`](format/format-bool.md) — Format a bool
- [`format-string`](format/format-string.md) — Format a string
- [`format-void`](format/format-void.md) — Format void

## S-expression

S-expression parsing, formatting, and related types.

### Types

- [`sexp-t`](sexp/sexp-t.md) — Located S-expression type
- [`source-location-t`](sexp/source-location-t.md) — Source location type
- [`source-span-t`](sexp/source-span-t.md) — Source span type
- [`source-position-t`](sexp/source-position-t.md) — Source position type

### Operations

- [`parse-sexps`](sexp/parse-sexps.md) — Parse to located S-expressions
- [`format-sexp`](sexp/format-sexp.md) — Format an S-expression
- [`sexp-collect-key-value-pairs`](sexp/sexp-collect-key-value-pairs.md) — Collect key-value pairs as a list
- [`sexp-collect-key-value-hash`](sexp/sexp-collect-key-value-hash.md) — Collect key-value pairs as a hash

## JSON

JSON values and operations.

### Type

- [`json-t`](json/json-t.md) — JSON value type

### Parse and format

- [`parse-json`](json/parse-json.md) — Parse a JSON string
- [`format-json`](json/format-json.md) — Format as a JSON string
