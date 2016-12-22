function $apply(subject, fn, params) {
  return fn(subject, params);
}

function $compose(fn, decorator, params) {
  if (fn) {
    return function(subject, nextParams) {
      var result = fn(subject);
      return $apply(result, decorator, params);
    };
  } else {
    return function(_, _) {
      return $apply(null, decorator, params);
    };
  }
}

function $tag(type, attrs, children) {
  this.type = type;
  this.attrs = attrs;
  this.children = children;
}
$tag.prototype = {
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

var $svg;
function $render() {
  while ($svg.firstChild) {
    $svg.removeChild($svg.firstChild);
  }

  var drawing = result();
  console.log(drawing);
  $svg.appendChild(drawing.render());
}

window.addEventListener('load', function() {
  console.log("starting");
  $svg = document.getElementById('canvas');
  $render();
});



var circle = function(subject, params) {
  return new $tag('circle', {
    cx: params.x || 0,
    cy: params.y || 0,
    r: params.radius || 10
  }, []);
};

var stretched = function(subject, params) {
  var transformString;
  console.log(params);
  if (params.multiplier !== undefined) {
    transformString = 'scale(' + params.multiplier + ')';
  } else {
    transformString = 'scale(' + params.x;
    if (params.y !== undefined) transformString += ', ' + params.y;
    transformString += ')';
  }
  return new $tag('g', {
    transform: transformString
  }, [subject]);
};

var shifted = function(subject, params) {
  var x = params.right || -params.left;
  var y = params.down || -params.up;
  return new $tag('g', {
    transform: 'translate(' + (x || 0) + ', ' + (y || 0) + ')'
  }, [subject]);
};



var my_drawing = $compose(  $compose(  $compose(  null,
  circle,
  {"radius": 50}
)
,
  stretched,
  {"multiplier": 2}
)
,
  shifted,
  {"down": 100, "right": 200}
)
;

var result = $compose(  null,
  my_drawing,
  {}
)
;