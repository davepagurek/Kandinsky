// PRIMITIVES

context.circle = function(_, params, calls) {
  return new tag('circle', {
    cx: materialize(params.x, 0, calls),
    cy: materialize(params.y, 0, calls),
    r: materialize(params.radius, 10, calls),
    fill: materialize(params.fill, "000", calls)
  }, []);
};

context.rectangle = function(_, params, calls) {
  return new tag('rect', {
    x: materialize(params.x, 0, calls),
    y: materialize(params.y, 0, calls),
    width: materialize(params.width, 10, calls),
    height: materialize(params.height, 10, calls),
    fill: materialize(params.fill, "000", calls)
  }, []);
};


// GROUPS

context.grouped = function(subject, params, calls) {
  return new tag(
    'g', {},
    materialize(params.drawings, [], calls).map(function(drawing) {
      return materialize(drawing, null, calls);
    }).concat([materialize(subject, null, calls)]).filter(function(drawing) {
      // Remove nulls
      return !!drawing;
    })
  );
};

context.with = function(subject, params, calls) {
  return context.grouped(null, {drawings: [
    materialize(subject, null, calls),
    materialize(params.drawing, null, calls)
  ]}, calls);
};

// TRANSFORMS

context.stretched = function(subject, params, calls) {
  var transformString;
  if ('by' in params) {
    transformString = 'scale(' + materialize(params.by, 1, calls) + ')';
  } else {
    var x = materialize(params.x, 1, calls);
    var y = materialize(params.y, x, calls);
    transformString = 'scale(' + x + ', ' + y + ')';
  }
  return new tag('g', {
    transform: transformString
  }, [materialize(subject, null, calls)]);
};

context.shifted = function(subject, params, calls) {
  var x = materialize(params.right, -materialize(params.left, 0, calls), calls);
  var y = materialize(params.down, -materialize(params.up, 0, calls), calls);
  return new tag('g', {
    transform: 'translate(' + x + ', ' + y + ')'
  }, [materialize(subject, null, calls)]);
};

context.rotated = function(subject, params, calls) {
  return new tag('g', {
    transform: 'rotate(' +
      materialize(params.angle, 0, calls) + ', ' +
      materialize(params.x, 0, calls) + ', ' +
      materialize(params.y, 0, calls) +
      ')'
  }, [materialize(subject, null, calls)]);
}

// LOGIC

context.identity = function(subject, _, calls) {
  return materialize(subject, null, calls);
};

context.or = function(subject, params, calls) {
  var materialized = materialize(subject, null, calls);
  if (materialized) {
    return materialized;
  } else {
    return materialize(params.drawing, null, calls);
  }
};

context.given = function(subject, params, calls) {
  condition = materialize(params.that, false, calls);
  if (condition) {
    return materialize(params.then, null, calls);
  } else {
    return materialize(params.else, null, calls);
  }
};

context.lt = function(_, params, calls) {
  lhs = materialize(params.lhs, 0, calls);
  rhs = materialize(params.rhs, 0, calls);
  return lhs < rhs;
}

// UTILS

context.random = function(_, params, calls) {
  var high = materialize(params.to, 1, calls);
  var low = materialize(params.from, 0, calls);
  return Math.random() * (high - low) + low;
};

context.repeated = function(_, params, calls) {
  var times = materialize(params.times, 1, calls);
  return Array.apply(null, Array(times)).map(function() {
    return materialize(params.each, null, calls);
  });
};

context.depth_limited = function(subject, params, calls) {
  var fn = materialize(params["call"], "", calls);
  var max = materialize(params.max, 0, calls);
  if (calls[fn] > max) {
    return null;
  } else {
    return materialize(subject, null, calls);
  }
}
