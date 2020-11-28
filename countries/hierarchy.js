const svg = d3.select('svg');
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { left: 65, top: 0, rigth: 70, bottom: 0 };
const innerWidth = width - margin.left - margin.rigth;
const innerHeight = height - margin.top - margin.bottom;

const g = svg
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.call(
  d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
  })
);

function render(data) {
  const treeCanvas = d3.tree().size([innerHeight, innerWidth]);
  const root = d3.hierarchy(data);
  const edges = treeCanvas(root).links();
  const pathGenerator = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  g.selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('d', pathGenerator);

  g.selectAll('text')
    .data(root.descendants())
    .enter()
    .append('text')
    .attr('x', (d) => d.y)
    .attr('y', (d) => d.x)
    .attr('dy', '0.32em')
    .attr('text-anchor', (d) => (d.children ? 'middle' : 'start'))
    .attr('font-size', (d) => 3.2 - d.depth + 'em')
    .text((d) => d.data.data.id);
}

d3.json('countries.json').then((data) => {
  render(data);
});
