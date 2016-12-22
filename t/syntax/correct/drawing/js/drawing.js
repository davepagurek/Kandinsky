function apply(subject, fn, params) {
  return fn(subject, params);
}

function compose(fn, decorator, params) {
  if (fn) {
    return function(subject, nextParams) {
      var result = fn(subject);
      return apply(result, decorator, params);
    };
  } else {
    return function(_, _) {
      return apply(null, decorator, params);
    };
  }
}

function tag(type, attrs, children) {
  this.type = type;
  this.attrs = attrs;
  this.children = children;
}
tag.prototype = {
  ns: 'http://www.w3.org/2000/svg',
  render: function() {
    var elem = document.createElementNS(this.ns, this.type);

    for (var attr in this.attrs) {
      elem.setAttributeNS(null, attr, this.attrs[attr]);
    }

    this.children.forEach(function(child) {
      elem.appendChild(child.render());
    });

    return elem;
  }
}

var svg;
function render() {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  var drawing = kan_result();
  console.log(drawing);
  svg.appendChild(drawing.render());
}

window.addEventListener('load', function() {
  console.log("starting");
  svg = document.getElementById('canvas');
  render();
});



var kan_circle = function(subject, params) {
  return new tag('circle', {
    cx: params.x || 0,
    cy: params.y || 0,
    r: params.radius || 10
  }, []);
};

var kan_with = function(subject, params) {
  return new tag('g', {}, [
    subject,
    params.drawing()
  ]);
}

var kan_stretched = function(subject, params) {
  var transformString;
  if (params.by !== undefined) {
    transformString = 'scale(' + params.by + ')';
  } else {
    transformString = 'scale(' + params.x;
    if (params.y !== undefined) transformString += ', ' + params.y;
    transformString += ')';
  }
  return new tag('g', {
    transform: transformString
  }, [subject]);
};

var kan_shifted = function(subject, params) {
  var x = params.right || -params.left;
  var y = params.down || -params.up;
  return new tag('g', {
    transform: 'translate(' + (x || 0) + ', ' + (y || 0) + ')'
  }, [subject]);
};



var kan_my_drawing = compose(compose(compose(null, kan_circle, {"radius": 50}, ), kan_stretched, {"by": 2}, ), kan_shifted, {"down": 100, "right": 200}, );

var kan_result = compose(compose(null, kan_my_drawing, {}, ), kan_with, {"drawing": compose(compose(compose(null, kan_my_drawing, {}, ), kan_stretched, {"by": 0.25}, ), kan_shifted, {"down": 400, "right": 400}, )}, );