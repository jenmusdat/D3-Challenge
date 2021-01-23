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
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
d3.csv("data/data.csv").then(
  function (data) {

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
    var xTimeScale = d3
      .scaleTime()
      .domain(d3.extent(medalData, (d) => d.date))
      .range([0, width]);

    var yLinearScale = d3
      .scaleLinear()
      .domain([0, d3.max(medalData, (d) => d.medals)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xTimeScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // append circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(medalData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xTimeScale(d.date))
      .attr("cy", (d) => yLinearScale(d.medals))
      .attr("r", "10")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    // date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%d-%b");

    // Step 1: Append tooltip div
    var toolTip = d3.select("body").append("div").classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup
      .on("mouseover", function (d) {
        toolTip
          .style("display", "block")
          .html(
            `<strong>${dateFormatter(d.date)}<strong><hr>${
              d.medals
            } medal(s) won`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      // Step 3: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function () {
        toolTip.style("display", "none");
      });
  },
  function (error) {
    console.log(error);
  }
);
