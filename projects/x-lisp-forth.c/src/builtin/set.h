#pragma once

x_fn_0_t x_make_set;
x_fn_1_t x_any_set_p;
x_fn_1_t x_set_copy;
x_fn_1_t x_set_size;
x_fn_1_t x_set_empty_p;
x_fn_2_t (mod, "set-member?", x_set_member_p);
x_fn_2_t (mod, "set-add!", x_set_add_mut);
x_fn_2_t (mod, "set-add", x_set_add);
x_fn_2_t (mod, "set-delete!", x_set_delete_mut);
x_fn_2_t (mod, "set-delete", x_set_delete);
x_fn_1_t (mod, "set-clear!", x_set_clear_mut);
x_fn_2_t (mod, "set-union", x_set_union);
x_fn_2_t (mod, "set-inter", x_set_inter);
x_fn_2_t (mod, "set-difference", x_set_difference);
x_fn_2_t (mod, "set-subset?", x_set_subset_p);
x_fn_2_t (mod, "set-disjoint?", x_set_disjoint_p);
x_fn_1_t (mod, "set-to-list", x_set_to_list);
