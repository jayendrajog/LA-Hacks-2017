var imgURL = "assets/stream-example.jpg";

var StreamContainer = React.createClass({
  render: function() {
    return (
      <div id="stream-container">
        <img id="stream-image" src={imgURL} />
        <div id="face-rectangles-container"></div>
      </div>
    );
  }
});

var Stats = React.createClass({
  render: function() {
    return (
      <div id="stats"></div>
    );
  }
});

var ContentLeft = React.createClass({
  render: function() {
    return (
      <div id="content-left">
        <StreamContainer />
        <Stats />
      </div>
    );
  }
});

var Students = React.createClass({

  render: function() {
    return (
      <div id="students">

      </div>
    );
  }
});

var Container = React.createClass({
  render: function() {
    return (
      <div id="content-container">
        <ContentLeft />
        <Students />
      </div>
    );
  }
});

ReactDOM.render(<Container />, document.getElementById('content'), function(){
  setTimeout(function(){
    var FaceRectangles = React.createClass({
      render: function() {
        var streamImage = document.getElementById("stream-image");
        var imgOriginalWidth = streamImage.naturalWidth;
        console.log(imgOriginalWidth);
        var ratio = streamImage.getBoundingClientRect().width / imgOriginalWidth;
        var faceRectangles = [];
        studentsArr.map(function(student){
          var faceStyle = {
            position: "absolute",
            border: "2px solid " + (student.attention == 0 ? "#ff7f9b" : "#20d3b0"),
            left: ratio * student.coordinates[0],
            top: ratio * student.coordinates[1],
            width: ratio * student.coordinates[2],
            height: ratio * student.coordinates[3]
          };
          faceRectangles.push(
            <div style={faceStyle}></div>
          );
        });
        return (
          <div id="face-rectangles-inner">
            {faceRectangles}
          </div>
        );
      }
    });

    ReactDOM.render(<FaceRectangles />, document.getElementById('face-rectangles-container'));
  }, 500);
});

// setInterval(tick, 2000);
