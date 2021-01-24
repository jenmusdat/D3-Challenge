var svgArea = d3.select("body").select("svg");

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50,
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html(function (d) {
    return `${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`;
  });

/* Invoke the tip in the context of your visualization */
svg.call(tip);

var chosenXAxis = "poverty";
function xScale(stateData, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(stateData, (d) => d[chosenXAxis]) * 0.7,
      d3.max(stateData, (d) => d[chosenXAxis]),
    ])
    .range([0, width]);
  return xLinearScale;
}
// Read CSV
d3.csv("assets/data/data.csv").then(
  function (stateData) {
    // parse data
    stateData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // create scales
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = d3
      .scaleLinear()
      .domain([0, d3.max(stateData, (d) => d.healthcare)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // append circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "purple")
      .attr("stroke-width", "1")
      .attr("stroke", "black")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    var textGroup = chartGroup
      .selectAll("text.abbr")
      .data(stateData)
      .enter()
      .append("text")
      .attr("class", "abbr")
      .text((d) => d.abbr)
      .attr("dx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("dy", (d) => yLinearScale(d.healthcare))
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .style("color", "white")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("Poverty Rate");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Healthcare Access");
    console.log(svg);
  },
  function (error) {
    console.log(error);
  }
);
