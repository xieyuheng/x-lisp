#include "index.h"

primitive_t *
make_primitive(size_t arity, x_fn_t *fn) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN;
    self->fn = fn;
    self->arity = arity;
    return self;
}

primitive_t *
make_primitive_0(x_fn_0_t *fn_0) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_0;
    self->fn_0 = fn_0;
    self->arity = 0;
    return self;
}

primitive_t *
make_primitive_1(x_fn_1_t *fn_1) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_1;
    self->fn_1 = fn_1;
    self->arity = 1;
    return self;
}

primitive_t *
make_primitive_2(x_fn_2_t *fn_2) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_2;
    self->fn_2 = fn_2;
    self->arity = 2;
    return self;
}

primitive_t *
make_primitive_3(x_fn_3_t *fn_3) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_3;
    self->fn_3 = fn_3;
    self->arity = 3;
    return self;
}

primitive_t *
make_primitive_4(x_fn_4_t *fn_4) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_4;
    self->fn_4 = fn_4;
    self->arity = 4;
    return self;
}

primitive_t *
make_primitive_5(x_fn_5_t *fn_5) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_5;
    self->fn_5 = fn_5;
    self->arity = 5;
    return self;
}

primitive_t *
make_primitive_6(x_fn_6_t *fn_6) {
    primitive_t *self = new(primitive_t);
    self->fn_kind = X_FN_6;
    self->fn_6 = fn_6;
    self->arity = 6;
    return self;
}

void
primitive_free(primitive_t *self) {
    free(self);
}
