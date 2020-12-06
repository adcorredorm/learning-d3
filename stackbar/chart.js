// Original code: http://bl.ocks.org/mstanaland/6100713
// Setup svg using Bostock's margin convention

function render(data) {
  const title = 'Casos por acta';
  var programs = new Set();

  data.forEach((d) => {
    d.key = d.key.replace('.0', '');
    d.value = JSON.parse(d.value.replaceAll("'", '"'));
    programs = new Set([...Object.keys(d.value), ...programs]);
  });

  data.forEach((d) => {
    programs.forEach((p) => {
      d[p] = p in d.value ? d.value[p] : 0;
    });
    delete d.value;
  });

  programs = [...programs];

  var margin = { top: 50, right: 80, bottom: 50, left: 30 };

  var width = document.body.clientWidth - margin.left - margin.right;
  var height = document.body.clientHeight - margin.top - margin.bottom;

  d3.select('svg').remove();

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', -20)
    .text(title);

  // Transpose the data into layers
  var dataset = d3.layout.stack()(
    programs.map(function (p) {
      return data.map(function (d) {
        return { x: d.key, y: d[p], program: p };
      });
    })
  );

  // Set x, y and colors
  var x = d3.scale
    .ordinal()
    .domain(
      dataset[0].map(function (d) {
        return d.x;
      })
    )
    .rangeRoundBands([10, width - 10], 0.02);

  var y = d3.scale
    .linear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d3.max(d, function (d) {
          return d.y0 + d.y;
        });
      }),
    ])
    .range([height, 0]);

  function getColors(n) {
    const choices = [
      'BDBEA9',
      '8DB38B',
      '56876D',
      '04724D',
      '423629',
      '4F5D2F',
      'A26769',
      '582C4D',
      '3A3335',
      '000000',
    ];
    var colors = [];
    for (let i = 0; i < n; i++) colors.push(choices[i % choices.length]);
    return colors;
  }

  var colors = getColors(programs.length);

  // Define and draw axes
  var yAxis = d3.svg
    .axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat(function (d) {
      return d;
    });

  var xAxis = d3.svg.axis().scale(x).orient('bottom');

  svg.append('g').attr('class', 'y axis').call(yAxis);

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  // Create groups for each series, rects for each segment
  var groups = svg
    .selectAll('g.cost')
    .data(dataset)
    .enter()
    .append('g')
    .attr('class', 'cost')
    .style('fill', function (d, i) {
      return colors[i];
    });

  var rect = groups
    .selectAll('rect')
    .data(function (d) {
      return d;
    })
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d.x);
    })
    .attr('y', function (d) {
      return y(d.y0 + d.y);
    })
    .attr('height', function (d) {
      return y(d.y0) - y(d.y0 + d.y);
    })
    .attr('width', x.rangeBand())
    .on('mouseover', function () {
      d3.selectAll('rect').attr('opacity', 0.7);
      d3.select(this)
        .attr('opacity', 1)
        .attr('stroke', 'white')
        .attr('stroke-width', 5);
      tooltip.style('display', null);
    })
    .on('mouseout', function () {
      d3.selectAll('rect').attr('opacity', 1);
      d3.select(this).attr('stroke', 'none').attr('stroke-width', 0);
      tooltip.style('display', 'none');
    })
    .on('mousemove', function (d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr(
        'transform',
        'translate(' + xPosition + ',' + yPosition + ')'
      );
      tooltip.select('text').text(`${d.program} - ${d.y}`);
    });

  // Draw legend
  var legend = svg
    .selectAll('.legend')
    .data(colors)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      return 'translate(30,' + i * 19 + ')';
    });

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', function (d, i) {
      return colors.slice()[i];
    });

  legend
    .append('text')
    .attr('x', width + 5)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(function (_, i) {
      return programs[i];
    });

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg
    .append('g')
    .attr('class', 'tooltip')
    .style('display', 'none');

  tooltip
    .append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .attr('font-size', '13px')
    .attr('font-weight', 'bold');
}
