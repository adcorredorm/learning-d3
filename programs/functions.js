function login() {
  return fetch(baseUrl + 'login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log('Error: ' + error);
    });
}

function map_reduce(token, map, reduce, query) {
  const url = baseUrl + 'report';
  const fullUrl = query === '' ? url : url + '?' + query;
  return fetch(fullUrl, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
    },
    body: JSON.stringify({
      map: map.toString(),
      reduce: reduce.toString(),
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log('Error: ' + error);
    });
}
