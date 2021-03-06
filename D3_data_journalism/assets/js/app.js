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
      d3.min(stateData, (d) => d[chosenXAxis]) * 0.9,
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
      .domain([4, d3.max(stateData, (d) => d.healthcare)])
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
      .attr("r", "12")
      .attr("fill", "yellow")
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
      .style("font-size", "10px")
      .style("color", "white")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    chartGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("fill", "red")
      .text("In Poverty(%)");

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("fill", "red")
      .text("Lacks Healthcare Access (%)");
  },
  function (error) {
    console.log(error);
  }
);
