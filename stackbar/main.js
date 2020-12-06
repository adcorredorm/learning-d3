var token = '';

function map() {
  value = {};
  value[this.academic_program] = 1;
  emit(this.consecutive_minute, value);
}
function reduce(_, values) {
  programs = {};
  values.forEach((o) => {
    Object.keys(o).forEach((v) => {
      programs[v] = v in programs ? programs[v] + o[v] : o[v];
    });
  });

  return programs;
}

function make_query(query_str, init_date, end_date) {
  var query = query_str;
  query +=
    init_date !== undefined && init_date !== ''
      ? `&date__gte=${init_date}`
      : '';
  query +=
    end_date !== undefined && end_date !== '' ? `&date__lte=${end_date}` : '';
  query = query.startsWith('&') ? query.substring(1) : query;

  map_reduce(token, map, reduce, query).then((res) => render(res.results));
}

login()
  .then((res) => (token = res.token))
  .then(() => make_query('', '', ''));
