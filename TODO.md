# define-metadata

[basic-lisp.js] `MetadataDefinition` -- for untagged data

[basic-lisp.js] `DefineMetadata`
[basic-lisp.js] parse `(define-metadata)`

[basic-lisp.js] `Chunk` for `MetadataDefinition`
[basic-lisp.js] parse `(chunk)`

[basic-lisp.js] `Directive` for `MetadataDefinition`

- `Int` `Float`
- `Pointer` -- resolve like label (but no external)
- `String` -- always null ended
- `StringPointer` -- append `Chunk` to the end of this `MetadataDefinition`

[basic-lisp.js] parse directives

[x-lisp-boot.js] `040-SelectInstructionPass` -- translate `B.MetadataDefinition` to `M.DataDefinition`

# function constant

[x-lisp-boot.js] `ExplicateControlPass` -- setup `FunctionDefinition` to `make-curry` for now

```scheme
(define-function <name>)
(define-variable _<name>/constant)
(define-setup _<name>/setup
  (block body
    (= address (literal (@address <name>)))
    (= arity (literal <arity>))
    (= size (literal 0))
    (= curry (call (@primitive-function make-curry 3) address arity size))
    (store _<name>/constant curry)
    (return)))
```

[x-lisp-boot.js] `ExplicateControlPass` -- setup `FunctionDefinition` to `make-function`

```scheme
(define-function <name>)
(define-metadata _<name>/metadata
  (chunk arity (int <arity>))
  (chunk name (string-pointer "<name>"))
  (chunk address (pointer <label>))
  (chunk variable-array (int ...) (pointer variable-names))
  (chunk register-info (pointer _<name>/register-info))
  (chunk variable-names (string-pointer "<name>") (string-pointer "<name>") ...))
(define-variable _<name>/constant)
(define-setup _<name>/setup
  (block body
    (= address (literal (@address <name>)))
    (= metadata (literal (@address _<name>/metadata)))
    (= function (call (@primitive-function make-function 2) address metadata))
    (store _<name>/constant function)
    (return)))
```

# function object

[runtime.c] `function_t` -- has `address` and `arity` and `is_primitive`
[runtime.c] `curry_t` -- has `function_t` instead of `address_t`
[runtime.c] `object_spec_t` -- has `get_slot_fn`
[runtime.c] `function_t` -- has register map

[runtime.c] [maybe] use inline union for `address` to avoid casting

# setup funtion

[x-lisp-boot.js] `040-SelectInstructionPass` -- literal address instead of literal function
[x-lisp-boot.js] setup funtion to `make-function`

# scan call stack

primitive funtion to test scan call stack -- print stack trace

- when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.

# later

[x-lisp-boot.js] `030-ExplicateControlPass` -- compile constant to non-lazy setup code

- if we can ensure all function setup runs before constant setup

  - `define-setup` -- take stage as argument

[x-lisp-boot.js] `encodeValue` -- need sexp.js to really support js `bigint`
