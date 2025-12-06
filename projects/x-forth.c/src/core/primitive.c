#include "index.h"

primitive_t *
make_primitive_from_fn(const char *name, primitive_fn_t *fn) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN;
    self->fn = fn;
    return self;
}

primitive_t *
make_primitive_from_fn_0(const char *name, primitive_fn_0_t *fn_0) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_0;
    self->fn_0 = fn_0;
    return self;
}

primitive_t *
make_primitive_from_fn_1(const char *name, primitive_fn_1_t *fn_1) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_1;
    self->fn_1 = fn_1;
    return self;
}

primitive_t *
make_primitive_from_fn_2(const char *name, primitive_fn_2_t *fn_2) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_2;
    self->fn_2 = fn_2;
    return self;
}

primitive_t *
make_primitive_from_fn_3(const char *name, primitive_fn_3_t *fn_3) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_3;
    self->fn_3 = fn_3;
    return self;
}

primitive_t *
make_primitive_from_fn_4(const char *name, primitive_fn_4_t *fn_4) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_4;
    self->fn_4 = fn_4;
    return self;
}

primitive_t *
make_primitive_from_fn_5(const char *name, primitive_fn_5_t *fn_5) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_5;
    self->fn_5 = fn_5;
    return self;
}

primitive_t *
make_primitive_from_fn_6(const char *name, primitive_fn_6_t *fn_6) {
    primitive_t *self = new(primitive_t);
    self->name = name;
    self->fn_kind = PRIMITIVE_FN_6;
    self->fn_6 = fn_6;
    return self;
}

void
primitive_free(primitive_t *self) {
    free(self);
}
