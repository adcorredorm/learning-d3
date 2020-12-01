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

function mouseover(e, d) {
  const obj = d3.select(this);
  const textSel = obj.selectAll('text');
  textSel.style('visibility', 'visible');
  obj.select('polyline').style('visibility', 'visible');
  obj.select('path').attr('stroke', 'white').attr('stroke-width', 3);

  d3.select('#mainText').text(textSel.text()).style('visibility', 'visible');
}

function mouseout(e, d) {
  const obj = d3.select(this);
  obj.selectAll('text').style('visibility', 'hidden');
  obj.select('polyline').style('visibility', 'hidden');
  obj.select('path').attr('stroke', 'none').attr('stroke-width', 1);

  d3.select('#mainText').text('').style('visibility', 'hidden');
}

function render(data) {
  // parameters
  const r = Math.min(innerHeight, innerWidth) / 2;
  const innerR = r * 0.4;
  const outerR = r * 0.8;
  const linesR = r * 0.9;
  const title = 'Casos por tipo';

  // functions
  const getKey = (d) => d.data.key;
  const getValue = (d) => parseInt(d.data.value);
  const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  const arc = d3.arc().innerRadius(innerR).outerRadius(outerR);

  const outerArc = d3.arc().innerRadius(linesR).outerRadius(linesR);

  const pie = d3
    .pie()
    .value((d) => d.value)
    .sortValues((a, b) => (a < b ? 1 : -1));

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.key))
    .range(d3.schemeTableau10);

  g.append('text').attr('id', 'title').text(title).attr('y', -r);

  g.append('text')
    .attr('id', 'mainText')
    .style('visibility', 'hidden')
    .attr('y', r);

  const groups = g
    .selectAll('g')
    .data(pie(data), getKey)
    .enter()
    .append('g')
    .attr('class', (d) => `${getKey(d).replaceAll(' ', '')}`)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);

  groups
    .append('path')
    .style('fill', (d) => color(getKey(d)))
    .attr('d', arc);

  groups
    .append('text')
    .attr('dy', '.35em')
    .text((d) =>
      midAngle(d) < Math.PI
        ? `(${getValue(d)}) ${getKey(d)}`
        : `${getKey(d)} (${getValue(d)})`
    )
    .style('text-anchor', (d) => (midAngle(d) < Math.PI ? 'start' : 'end'))
    .style('visibility', 'hidden')
    .attr('transform', (d) => {
      const pos = outerArc.centroid(d);
      pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    });

  groups
    .append('polyline')
    .style('visibility', 'hidden')
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
  .then(() => map_reduce(token, map, reduce, 'date_stamp__gte=2020-09-01'))
  .then((res) => render(res.results));
