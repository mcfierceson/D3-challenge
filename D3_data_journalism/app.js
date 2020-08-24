// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(dabData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  dabData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });
  
  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(dabData, d => d.obesity)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(dabData, d => d.poverty)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles with text
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(dabData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.obesity))
  .attr("cy", d => yLinearScale(d.poverty))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", "0.25");

  var stateGroup = chartGroup.selectAll("text")
  .data(dabData)
  .enter()
  .append("text")
  .text( function (d) { return d.abbr; })
  .attr("x", d => Scale(d.obesity))
  .attr("y", d => yLinearScale(d.poverty))
  .attr("dy", 4)
  .attr("fill", "white")
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Obesity Rate (%)");
}).catch(function(error) {
  console.log(error);
})