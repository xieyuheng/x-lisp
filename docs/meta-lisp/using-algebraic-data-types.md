---
title: Using Algebraic Data Types
---

meta-lisp provides `(define-struct)` for single-constructor types and `(define-enum)` for multi-constructor types.

## A first attempt

Say we want to model a user: an id, and possibly an email, possibly a phone.
(The types `email-address-t` and `phone-number-t` are assumed to be defined elsewhere.)

```meta-lisp
(define-struct user-t
  (id int-t)
  (email (maybe-t email-address-t))
  (phone (maybe-t phone-number-t)))
```

This works, but the type allows a state that the domain forbids: a user with neither email nor phone.

## Better: encode the cases in the type

A user must have at least one contact method. There are exactly three cases: email only, phone only, or both.

```meta-lisp
(define-struct user-t
  (id int-t)
  (contact user-contact-t))

(define-enum user-contact-t
  (email-contact (email email-address-t))
  (phone-contact (phone phone-number-t))
  (both-contact (email email-address-t) (phone phone-number-t)))
```

The illegal state is gone: it is impossible to construct a user without a contact method.

## A new requirement

Now we need system users, who have no email or phone.

A tempting change: add a `(maybe-t user-contact-t)` field and an `is-system-user` flag.

```meta-lisp
(define-struct user-t
  (id int-t)
  (contact (maybe-t user-contact-t))
  (is-system-user bool-t))
```

The two fields combine into four states, one of which is illegal: a non-system user without contact. The type system cannot prevent it.

## Better: add a constructor

The new requirement is not a new field — it is a new case of user contact.

```meta-lisp
(define-struct user-t
  (id int-t)
  (contact user-contact-t))

(define-enum user-contact-t
  (system-contact)
  (email-contact (email email-address-t))
  (phone-contact (phone phone-number-t))
  (both-contact (email email-address-t) (phone phone-number-t)))
```

The change is local: `user-t` stays untouched. All four states are legal, and all four are represented.
