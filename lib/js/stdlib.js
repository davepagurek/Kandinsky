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
