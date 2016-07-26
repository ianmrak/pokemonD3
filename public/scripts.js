$(document).ready(function() {
  $("#search").on('submit', function(e) {
    e.preventDefault();
    var query = (e.target.input.value).toLowerCase();
    $('.input').val('');
    $(chart).fadeOut(function() {
        $(chart).empty();
    });
    if (available) {
      available = false;
    $.ajax({
      url: 'http://pokeapi.co/api/v2/pokemon/'+query+'/',
      success: function(data) {
        currentPokemon.name = data.name;
        currentPokemon.stats = [];
        data.stats.forEach(function(stat) {
          currentPokemon.stats.push([stat.stat.name, stat.base_stat]);
        })
        currentPokemon.sprites = data.sprites;
        $(chart).fadeIn();
        buildChart(currentPokemon)
        available = true;
      },
      error: function(err) {
        available = true;
      }
    });
  }
  });
  var chart = document.querySelector('.chart');
  var available = true;
  var currentPokemon = {}
  var w = 500;
  var h = 500;
  var width = w - 1;
  var height = h - 1;
  var radius = Math.min(width, height) / 2;
  var innerRadius = 0.3 * radius;

  var svgFixed = d3.select('.chart-fixed').append('svg')
  .attr('width', w)
  .attr('height', h)
  .append('g')
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

/* SPAGHETTI D3!!!!!11!1! */
function buildChart(data) {

  var svg = d3.select('.chart').append('svg')
  .attr('width', w)
  .attr('height', h)
  .append('g')
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      return d.data[0] + ": <span style='color:orangered'>" + d.data[1] + "</span>";
    });

  svg.call(tip);

  var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return 6; })

  var outerArc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius)

  var innerArc = d3.svg.arc()
  .innerRadius(0)
  .outerRadius(innerRadius)

  var outerPath = svg.selectAll('.outerArc')
  .data(pie([1,1,1,1,1,1]))
  .enter().append('path')
  .attr('class', 'outerArc')
  .attr('stroke', 'gray')
  .attr('class', 'outerArc')
  .attr('d', outerArc);


  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(function(d) {
      return (radius - innerRadius) * (d.data[1] / 250) +innerRadius
    })

  var path = svg.selectAll('path')
    .data(pie(data.stats), function(d) {
      return d.data;
    })
    .enter().append('path')
      .attr('class', function(d) {
        return 'colorArc ' + d.data[0];
      })
      .attr('opacity', 0)
      .attr('d', arc)
      .attr('stroke', 'gray')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
    .transition()
      .duration(750)
      .attr('opacity', 1)
      .attrTween("transform", function() { return d3.interpolateString("scale(0)", "scale(1)" )});

  var innerPath = svg.selectAll('.innerArc')
    .data(pie([1]))
    .enter().append('path')
    .attr('class', 'innerArc')
    .attr('d', innerArc)

  var image = svg.append('svg:image')
    .attr('class', 'image')
    .attr('opacity', 0)
    .attr("link:href", data.sprites.front_default)
    .attr('width', 120)
    .attr('height', 120)
    .attr('x', -60)
    .attr('y', -60)
  .transition()
    .duration(750)
    .attr('opacity', 1);

  var name = data.name[0].toUpperCase() + data.name.slice(1);
  var text = svg.append('svg:text')
    .text(name)
    .attr('text-anchor', 'middle')
    .attr('dy', '3.7em')
  }
})
