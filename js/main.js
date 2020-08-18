//first line of main.js. wrap everything in a self-executing anonymous function to move to a local scope
(function(){

setTree();

function setTree() {

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 500 - margin.left - margin.right,
      height = 850 - margin.top - margin.bottom;

  var svg = d3.select("#treemap")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read json
  d3.json("/data/soldiers_bystate.json", function(data) {

    var root = d3.hierarchy(data).sum(function(d){ return d.value})
  //d3.treemap to position each element
  d3.treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3)  //padding between boxes
    (root)

  //color scale
  var color = d3.scaleOrdinal()
    .domain(["Union", "Confederate", "Border"])
    .range(["#0D0E26","#A6032F","#C7CFD9"])

  //opacity depending on value
  var opacity = d3.scaleLinear()
      .domain([100000, 510000])
      .range([.7, 1])

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function(d){ return color(d.parent.data.state)} )
        .style("opacity", function(d){ return opacity(d.data.value)})

    //text labels
    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
          .attr("x", function(d){ return d.x0+5})
          .attr("y", function(d){ return d.y0+20})
          .text(function(d) { return d.data.state })
          .attr("font-size", "16px")
          .attr("fill", "white")
          .attr("word-break", "break-all")
    svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})
          .attr("y", function(d){ return d.y0+35})
          .text(function(d){ return d.data.value })
          .attr("font-size", "12px")
          .attr("fill", "white")

    svg
        .selectAll("titles")
        .data(root.descendants().filter(function(d){ return d.depth==1}))
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0})
          .attr("y", function(d){ return d.y0+21})
          .text(function(d){ return d.data.state })
          .attr("font-size", "19px")
          .attr("fill", function(d){ return color(d.data.state)} )

    //add treemap title
    svg
        .append("text")
            .attr("x", 0)
            .attr("y", 14)
            .text("Civil War Soldiers in thousands")
            .attr("font-size", "16px")
            .attr("fill", "grey" )
});

};
})(); //last line of main.js
