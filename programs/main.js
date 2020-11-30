var token = '';

function map() {
  emit(0, 1);
}
function reduce(_, values) {
  return Array.sum(values);
}

login()
  .then((res) => (token = res.token))
  .then(() => map_reduce(token, map, reduce, ''))
  .then((res) => console.log(res.results));
