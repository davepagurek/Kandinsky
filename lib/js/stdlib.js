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
};


// GROUPS

context.grouped = function(subject, params) {
  return new tag(
    'g', {},
    get(params, 'drawings').map(function(drawing) {
      if (isFunction(drawing)) {
        return drawing();
      } else {
        return drawing;
      }
    }).concat([subject]).filter(function(drawing) {
      return drawing;
    })
  );
};

context.with = function(subject, params) {
  return context.grouped(null, {drawings: [subject, get(params, 'drawing')]});
};

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

context.repeated = function(_, params) {
  var times = get(params, 'times', 1);
  return Array.apply(null, Array(times)).map(function() {
    return get(params, 'each');
  });
};
