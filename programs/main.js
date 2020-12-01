const svg = d3.select('svg');
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { left: 50, top: 50, rigth: 50, bottom: 50 };
const innerWidth = width - margin.left - margin.rigth;
const innerHeight = height - margin.top - margin.bottom;

const g = svg
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);

function render(data) {
  // parameters
  const r = (Math.min(innerHeight, innerWidth) / 2) * 0.8;
  const innerR = r * 0.4;
  const outerR = r * 0.8;
  const linesR = r * 0.95;

  // functions
  const totalCases = data.map((d) => +d.value).reduce((a, b) => a + b, 0);
  const getKey = (d) => d.data.key;
  const getValue = (d) => d.data.value;
  const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;
  const isRepresentative = (d) =>
    getValue(d) >= (totalCases / (data.length * 100)) * totalCases * 0.8;

  var arc = d3.arc().innerRadius(innerR).outerRadius(outerR);

  var outerArc = d3.arc().innerRadius(linesR).outerRadius(linesR);

  const pie = d3
    .pie()
    .value((d) => d.value)
    .sortValues((a, b) => (a < b ? 1 : -1));

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.key))
    .range(d3.schemeTableau10);

  const slices = g
    .append('g')
    .attr('class', 'slices')
    .selectAll('path.slice')
    .data(pie(data), getKey);

  slices
    .enter()
    .append('path')
    .style('fill', (d) => color(getKey(d)))
    .attr('class', 'slice')
    .attr('d', arc);

  const labels = g
    .append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(pie(data), getKey);

  labels
    .enter()
    .append('text')
    .attr('dy', '.35em')
    .text(getKey)
    .style('text-anchor', (d) => (midAngle(d) < Math.PI ? 'start' : 'end'))
    .style('visibility', (d) => (isRepresentative(d) ? 'visible' : 'hidden'))
    .attr('transform', (d) => {
      const pos = outerArc.centroid(d);
      pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    });

  const lines = g
    .append('g')
    .attr('class', 'lines')
    .selectAll('polyline')
    .data(pie(data), getKey);

  lines
    .enter()
    .append('polyline')
    .style('visibility', (d) => (isRepresentative(d) ? 'visible' : 'hidden'))
    .attr('points', (d) => {
      const pos = outerArc.centroid(d);
      pos[0] = r * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    });
}

var token = '';

function map() {
  emit(this._cls_display, 1);
}
function reduce(_, values) {
  return Array.sum(values);
}

login()
  .then((res) => (token = res.token))
  .then(() => map_reduce(token, map, reduce, ''))
  .then((res) => render(res.results));
