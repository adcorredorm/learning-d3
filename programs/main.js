var token = '';

function map() {
  emit(this._cls_display, 1);
}
function reduce(_, values) {
  return Array.sum(values);
}

function make_query(query_str, init_date, end_date) {
  console.log(query_str, init_date, end_date);
  var query = query_str;
  query +=
    init_date !== undefined && init_date !== ''
      ? `&date__gte=${init_date}`
      : '';
  query +=
    end_date !== undefined && end_date !== '' ? `&date__lte=${end_date}` : '';
  query = query.startsWith('&') ? query.substring(1) : query;
  console.log(query);
  map_reduce(token, map, reduce, query).then((res) => render(res.results));
}

login()
  .then((res) => (token = res.token))
  .then(() => make_query('', '', ''));
