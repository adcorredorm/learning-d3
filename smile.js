const svg = d3.select('svg');

const eye_r = 25;
const height = parseFloat(svg.attr('height'));
const width = parseFloat(svg.attr('width'));

const g = svg
  .append('g')
  .attr('transform', `translate(${height / 2}, ${width / 2})`);

const circle = g
  .append('circle')
  .attr('r', height / 2)
  .attr('fill', 'yellow')
  .attr('stroke', 'black');

const eye_l = g
  .append('circle')
  .attr('r', eye_r)
  .attr('cx', -100)
  .attr('cy', -100);

const eye_2 = g
  .append('circle')
  .attr('r', eye_r)
  .attr('cx', 100)
  .attr('cy', -100);

const mouth = g.append('path').attr(
  'd',
  d3.arc()({
    innerRadius: 140,
    outerRadius: 150,
    startAngle: Math.PI / 2,
    endAngle: (3 * Math.PI) / 2,
  })
);
