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



// PRIMITIVES

context.circle = function(subject, params) {
  return new tag('circle', {
    cx: params.x || 0,
    cy: params.y || 0,
    r: params.radius || 10
  }, []);
};

context.rectangle = function(subject, params) {
  return new tag('rect', {
    x: get(params, 'x', 0),
    y: get(params, 'y', 0),
    width: get(params, 'width', 10),
    height: get(params, 'height', 10)
  }, []);
}


// GROUPS

context.with = function(subject, params) {
  return new tag('g', {}, [
    subject,
    get(params, 'drawing')
  ]);
}

// TRANSFORMS

context.stretched = function(subject, params) {
  var transformString;
  if ('by' in params) {
    transformString = 'scale(' + get(params, 'by') + ')';
  } else {
    transformString = 'scale(' +
      get(params, 'x', 1) + ', ' +
      get(params, 'y', get(params, 'x', 1)) + ')';
  }
  return new tag('g', {
    transform: transformString
  }, [subject]);
};

context.shifted = function(subject, params) {
  var x = get(params, 'right', -get(params, 'left', 0));
  var y = get(params, 'down', -get(params, 'up', 0));
  return new tag('g', {
    transform: 'translate(' + (x || 0) + ', ' + (y || 0) + ')'
  }, [subject]);
};

context.rotated = function(subject, params) {
  return new tag('g', {
    transform: 'rotate(' +
      get(params, 'angle', 0) + ', ' +
      get(params, 'x', 0) + ', ' +
      get(params, 'y', 0) +
      ')'
  }, [subject]);
}

// LOGIC

context.identity = function(subject) {
  console.log("Returning self");
  console.log(subject);
  return subject;
};

context.given = function(subject, params) {
  condition = get(params, 'that', false);
  if (condition) {
    return apply(subject, getRef(params, 'then'), {});
  } else {
    return apply(subject, getRef(params, 'else'), {});
  }
};

context.lt = function(_, params) {
  lhs = get(params, 'lhs');
  rhs = get(params, 'rhs');
  return lhs < rhs;
}

// UTILS

context.random = function(_, params) {
  var high = get(params, 'to', 1);
  var low = get(params, 'from', 0);
  return Math.random() * (high - low) + low;
};



context.branch = compose(null, "rectangle", {"x": -4, "height": 54, "y": -50, "width": 8});

context.tree = compose(null, "given", {"then": compose(compose(null, "branch", {}), "with", {"drawing": compose(compose(compose(compose(null, "tree", {}), "stretched", {"x": 0.8, "y": 0.75}), "rotated", {"angle": compose(null, "random", {"to": 90, "from": -90})}), "shifted", {"up": 50})}), "that": compose(null, "lt", {"lhs": compose(null, "random", {}), "rhs": 0.8}), "else": compose(null, "branch", {})});

context.result = compose(compose(null, "tree", {}), "shifted", {"down": 400, "right": 400});