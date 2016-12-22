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
