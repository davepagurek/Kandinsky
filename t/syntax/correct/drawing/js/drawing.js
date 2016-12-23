var context = {};

function incrCalls(calls, name) {
  calls = calls || {};
  newCalls = {};
  for (var key in calls) {
    newCalls[key] = calls[key];
  }
  newCalls[name] = newCalls[name] || 0;
  newCalls[name]++;
  return newCalls;
}

function withMaxDepth(fn, name, max) {
  return function(subject, params, calls) {
    if (calls[name] > max) {
      return null;
    } else {
      return apply(subject, fn, params, calls);
    }
  };
}

function apply(subject, fn, params, calls) {
  return fn(subject, params, calls);
}

function compose(fn, decorator, params) {
  if (fn) {
    return function(subject, nextParams, calls) {
      var result = fn(subject, null, calls);
      return apply(result, context[decorator], params, incrCalls(calls, decorator));
    };
  } else {
    return function(_, _, calls) {
      return apply(null, context[decorator], params, incrCalls(calls, decorator));
    };
  }
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function get(params, key, fallback, calls) {
  if (key in params) {
    if (isFunction(params[key])) {
      return params[key](null, null, calls);
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
      if (child) elem.appendChild(child.render());
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

context.rectangle = function(subject, params, calls) {
  return new tag('rect', {
    x: get(params, 'x', 0, calls),
    y: get(params, 'y', 0, calls),
    width: get(params, 'width', 10, calls),
    height: get(params, 'height', 10, calls)
  }, []);
};


// GROUPS

context.grouped = function(subject, params, calls) {
  return new tag(
    'g', {},
    get(params, 'drawings', [], calls).map(function(drawing) {
      if (isFunction(drawing)) {
        return drawing(null, null, calls);
      } else {
        return drawing;
      }
    }).concat([subject]).filter(function(drawing) {
      return drawing;
    })
  );
};

context.with = function(subject, params, calls) {
  return context.grouped(null, {drawings: [subject, get(params, 'drawing', null, calls)]}, calls);
};

// TRANSFORMS

context.stretched = function(subject, params, calls) {
  var transformString;
  if ('by' in params) {
    transformString = 'scale(' + get(params, 'by', 1, calls) + ')';
  } else {
    transformString = 'scale(' +
      get(params, 'x', 1, calls) + ', ' +
      get(params, 'y', get(params, 'x', 1, calls), calls) + ')';
  }
  return new tag('g', {
    transform: transformString
  }, [subject]);
};

context.shifted = function(subject, params, calls) {
  var x = get(params, 'right', -get(params, 'left', 0, calls), calls);
  var y = get(params, 'down', -get(params, 'up', 0, calls), calls);
  return new tag('g', {
    transform: 'translate(' + (x || 0) + ', ' + (y || 0) + ')'
  }, [subject]);
};

context.rotated = function(subject, params, calls) {
  return new tag('g', {
    transform: 'rotate(' +
      get(params, 'angle', 0, calls) + ', ' +
      get(params, 'x', 0, calls) + ', ' +
      get(params, 'y', 0, calls) +
      ')'
  }, [subject]);
}

// LOGIC

context.identity = function(subject) {
  return subject;
};

context.given = function(subject, params, calls) {
  condition = get(params, 'that', false, calls);
  if (condition) {
    return apply(subject, getRef(params, 'then'), {}, calls);
  } else {
    return apply(subject, getRef(params, 'else'), {}, calls);
  }
};

context.lt = function(_, params, calls) {
  lhs = get(params, 'lhs', calls);
  rhs = get(params, 'rhs', calls);
  return lhs < rhs;
}

// UTILS

context.random = function(_, params, calls) {
  var high = get(params, 'to', 1, calls);
  var low = get(params, 'from', 0, calls);
  return Math.random() * (high - low) + low;
};

context.repeated = function(_, params, calls) {
  var times = get(params, 'times', 1, calls);
  return Array.apply(null, Array(times)).map(function() {
    return get(params, 'each', null, calls);
  });
};



context.branch = compose(null, "rectangle", {"x": -2, "height": 52, "y": -50, "width": 4});

context.leaf = compose(compose(null, "circle", {"radius": 15}), "shifted", {"up": 15});

context.tree = withMaxDepth(compose(null, "grouped", {"drawings": compose(null, "repeated", {"each": compose(compose(null, "given", {"then": compose(compose(compose(null, "branch", {}), "with", {"drawing": compose(compose(null, "tree", {}), "shifted", {"up": 50})}), "stretched", {"x": 0.8, "y": 0.75}), "that": compose(null, "lt", {"lhs": compose(null, "random", {}), "rhs": 0.5})}), "rotated", {"angle": compose(null, "random", {"to": 50, "from": -50})}), "times": 3})}), "tree", 5);

context.result = compose(compose(compose(null, "branch", {}), "with", {"drawing": compose(compose(null, "tree", {}), "shifted", {"up": 50})}), "shifted", {"down": 400, "right": 400});