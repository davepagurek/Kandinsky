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

function apply(subject, fn, params, calls) {
  return fn(subject, params, calls);
}

function compose(fn, decorator, params) {
  if (fn) {
    return function(subject, nextParams, calls) {
      var composed = function() {
        return fn(subject, null, calls);
      };
      return apply(composed, context[decorator], params, incrCalls(calls, decorator));
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
    return params[key];
  } else {
    return fallback || context.identity;
  }
}

function materialize(variable, fallback, calls) {
  if (isFunction(variable)) {
    return variable(null, null, calls) || fallback;
  } else {
    return variable || fallback;
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
