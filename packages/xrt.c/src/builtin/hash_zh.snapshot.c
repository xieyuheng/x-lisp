#include "index.h"

static void echo_hash(value_t hash) {
  x_println(x_hash_entries_zh(hash));
}

int main(void) {
  init_global_gc();

  // empty

  echo_hash(x_make_hash());

  // single entry

  {
    value_t hash = x_make_hash();
    x_hash_put_mut(x_bool(true), x_int(1), hash);
    echo_hash(hash);
  }

  // multiple entries

  {
    value_t hash = x_make_hash();
    x_hash_put_mut(x_object(intern_symbol("a")), x_int(1), hash);
    x_hash_put_mut(x_object(intern_symbol("b")), x_int(2), hash);
    echo_hash(hash);
  }
}