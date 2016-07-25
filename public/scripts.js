$(document).ready(function() {
  $("#search").on('submit', function(e) {
    e.preventDefault();
    var query = (e.target.input.value).toLowerCase();
    $.ajax({
      url: 'http://pokeapi.co/api/v2/pokemon/'+query+'/',
      success: function(data) {
        currentPokemon.name = data.name;
        currentPokemon.stats = [];
        data.stats.forEach(function(stat) {
          currentPokemon.stats.push([stat.stat.name, stat.base_stat]);
        })
        currentPokemon.sprites = data.sprites;
        $('.chart').empty();
        buildChart(currentPokemon)
      }
    });
  });
  
  var currentPokemon = {}
  var width = 500;
  var height = 500;
  var radius = Math.min(width, height) / 2;
  var innerRadius = 0.3 * radius;

function buildChart(data) {

  var svg = d3.select('.chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return 6; })

  var outerArc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius)

  var outerPath = svg.selectAll('.outerArc')
  .data(pie([1,1,1,1,1,1]))
  .enter().append('path')
  .attr('fill', 'none')
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
    .transition()
      .duration(750)
      .attr('opacity', 1)

  var image = svg.append('svg:image')
    .attr('opacity', 0)
    .attr("link:href", data.sprites.front_default)
    .attr('width', 100)
    .attr('height', 100)
    .attr('x', -50)
    .attr('y', -50)
  .transition()
    .duration(750)
    .attr('opacity', 1);
  }
})
