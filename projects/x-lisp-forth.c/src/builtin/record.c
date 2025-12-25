#include "index.h"

value_t
x_make_record(void) {
    return x_object(make_tael());
}

value_t
x_anything_record_p(value_t value) {
    return x_bool(tael_p(value));
}

value_t
x_record_copy(value_t record) {
    return x_object(tael_copy_only_attributes(to_tael(record)));
}
