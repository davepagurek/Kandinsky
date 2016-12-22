var context = {};

function apply(subject, fn, params) {
  return fn(subject, params);
}

function compose(fn, decorator, params) {
  if (fn) {
    return function(subject, nextParams) {
      var result = fn(subject);
      return apply(result, context[decorator], params);
    };
  } else {
    return function() {
      return apply(null, context[decorator], params);
    };
  }
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function get(params, key, fallback) {
  if (key in params) {
    if (isFunction(params[key])) {
      return params[key]();
    } else {
      return params[key];
    }
  } else {
    return fallback;
  }
}

function getRef(params, key, fallback) {
  if (key in params) {
    return params[key];
  } else {
    return fallback || context.identity;
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

  var drawing = context.result();
  console.log(drawing);
  svg.appendChild(drawing.render());
}

window.addEventListener('load', function() {
  console.log("starting");
  svg = document.getElementById('canvas');
  render();
});
