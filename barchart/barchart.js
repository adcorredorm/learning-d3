const svg = d3.select('svg');
const height = parseFloat(svg.attr('height'));
const width = parseFloat(svg.attr('width'));
const year = '2010';

function render(data) {
  const xValue = (d) => d['Country Name'];
  const yValue = (d) => d[year];
  const margin = { top: 20, right: 20, bottom: 20, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.05);

  const maxdata = d3.max(data, yValue);

  const yScale = d3.scaleLinear().domain([0, maxdata]).range([innerHeight, 0]);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(innerWidth)
    .tickFormat(d3.format('.2s'));

  g.append('g').call(yAxis).attr('transform', `translate(${innerWidth}, 0)`);
  g.selectAll('.domain').remove();
  g.selectAll('.tick line').attr('stroke', '#C0C088');

  const xAxis = d3.axisBottom(xScale).tickSize(innerHeight);

  g.append('g').call(xAxis).selectAll('.domain, .tick line').remove();

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(xValue(d)))
    .attr('y', (d) => yScale(yValue(d)))
    .attr('height', (d) => yScale(0) - yScale(yValue(d)))
    .attr('width', xScale.bandwidth())
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);

  function mouseover(e, d) {
    d3.select(this).attr('fill', '#b30707');
    g.append('text')
      .attr('id', d['Country Code'])
      .attr('x', xScale(xValue(d)))
      .attr('y', yScale(yValue(d)))
      .text(xValue(d) + '-' + yValue(d))
      .attr('fill', '#b30707');
  }

  function mouseout(e, d) {
    d3.select(this).attr('fill', 'black');
    g.select('#' + d['Country Code']).remove();
  }
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
