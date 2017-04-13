var fill = d3.scale.category20();

window.onload = function () {
  parseData();
  // addTagCloud(tags);
};

var parseData = function(){
  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');
  var keyword = [];
  fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];
      var textType = /text.*/;
      if (file.type.match(textType)) {
          var reader = new FileReader();
          reader.onload = function(e) {
              var text = reader.result;
              fileDisplayArea.innerText = text;

              var data = JSON.parse(text);
              var order = [];

              for(var obj in data){
                keyword.push({'text': obj, 'size': data[obj]["order"]*60});
              }
              addTagCloud(keyword);
          }
          reader.readAsText(file);
      } else {
          fileDisplayArea.innerText = "File not supported!"
      }
  });
};


var addTagCloud = function(keyword) {
  d3.layout.cloud().size([400, 300])
      .words(keyword)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
};

function draw(words) {
  d3.select("#tag_vis").append("svg")
      .attr("width", 400)
      .attr("height", 300)
    .append("g")
      .attr("transform", "translate(200,150)")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}
