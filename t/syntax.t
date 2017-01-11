use v6;

use Test;
plan *;

use lib "lib";
use Kandinsky;

subtest {
  for "t/syntax/correct".IO.dir -> $file {
    next unless $file ~~ /\.kan$/;
    lives-ok { Kandinsky.codegen($file.slurp) }, "Parses correct syntax for $file";
  }
  done-testing;
}, "Can parse correct files";

subtest {
  for "t/syntax/incorrect".IO.dir -> $file {
    next unless $file ~~ /\.kan$/;
    dies-ok { Kandinsky.codegen($file.slurp) }, "Doesn't parse incorrect syntax for $file";
  }
  done-testing;
}, "Does not parse incorrect files";

done-testing;
