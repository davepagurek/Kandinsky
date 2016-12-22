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
