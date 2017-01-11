use v6;

use Test;
plan *;

use lib "lib";
use Kandinsky;

subtest {
  my $tests = [
    {
      name => "decoration",
      code => q:to/END/,
        define my_drawing as
          circle;
          stretched: {multiplier: 2};
          shifted: {right: 20, left: 10}.
        END
      generated => q:to/END/,
        function my_drawing() {
          shifted(
            stretched(
              circle(),
              { multiplier: 2 }
            ),
            { right: 20, left: 10 }
          );
        }
        END
    },
  ];
  for $tests.list -> % (:code($code), :generated($generated), :name($name)) {
    todo "Write correct output code";
    ok Kandinsky.codegen($code).comb($generated), "Generates expected output for $name";
  }
  done-testing;
}, "Can parse correct files";

done-testing;
