#pragma once

value_t value_from_position(struct position_t position);
value_t value_from_span(struct span_t span);
value_t value_from_source_location(value_t path, struct span_t span);
