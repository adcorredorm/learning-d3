const svg = d3.select('svg');
const height = parseFloat(svg.attr('height'));
const width = parseFloat(svg.attr('width'));
const year = '2010';

function render(data) {
  const xValue = (d) => d[year];
  const yValue = (d) => d['Country Name'];
  const margin = { top: 20, right: 20, bottom: 20, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.05);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
    .remove();

  const xAxis = d3
    .axisTop(xScale)
    .tickFormat(d3.format('.2s'))
    .tickSize(-innerHeight);

  g.append('g').call(xAxis).selectAll('.domain').remove();
  g.selectAll('.tick line').attr('stroke', '#C0C088');

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', (d) => yScale(yValue(d)))
    .attr('width', (d) => xScale(xValue(d)))
    .attr('height', yScale.bandwidth());
}

function load(a, b) {
  svg.html('');
  d3.csv('populations.csv').then((data) => {
    data.forEach((d) => {
      d[year] = +d[year];
    });
    render(data.slice(a, b));
  });
}
