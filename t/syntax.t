use v6;

use Test;
plan *;

use lib "lib";
use Kandinsky;

subtest {
  for "t/syntax/correct".IO.dir -> $file {
    lives-ok { Kandinsky.codegen($file.slurp) }, "Parses correct syntax";
  }
  done-testing;
}, "Can parse correct files";

subtest {
  for "t/syntax/incorrect".IO.dir -> $file {
    dies-ok { Kandinsky.codegen($file.slurp) }, "Doesn't parse incorrect syntax";
  }
  done-testing;
}, "Does not parse incorrect files";

done-testing;
