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

value_t
x_record_length(value_t record) {
    return x_int(record_length(to_tael(record)->attributes));
}

value_t
x_record_empty_p(value_t record) {
    return x_bool(record_is_empty(to_tael(record)->attributes));
}

value_t
x_record_get(value_t key, value_t record) {
    return tael_get_attribute(to_tael(record), symbol_string(to_symbol(key)));
}

// value_t
// x_record_has_p(value_t key, value_t record) {
// }

// value_t
// x_record_put_mut(value_t key, value_t value, value_t record) {
// }

// value_t
// x_record_put(value_t key, value_t value, value_t record) {
// }

// value_t
// x_record_delete_mut(value_t key, value_t record) {
// }

// value_t
// x_record_delete(value_t key, value_t record) {
// }
