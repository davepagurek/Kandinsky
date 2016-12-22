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
