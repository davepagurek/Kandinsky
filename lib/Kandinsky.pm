use v6;

use Kandinsky::Grammar;
use Kandinsky::Actions;
use Kandinsky::Node;

class Kandinsky {
  method codegen(Str $input --> Str) is export {
    my $match = Kandinsky::Grammar.subparse($input, actions => Kandinsky::Actions.new);
    if $match {
      if $match.to != $input.chars {
        die "Unexpected token: {$input.substr($match.to, *-1)}";
      } else {
        my $program = $match.made.to-code;
        my $base = "{$?FILE.IO.dirname}/js/base.js".IO.slurp;
        my $stdlib = "{$?FILE.IO.dirname}/js/stdlib.js".IO.slurp;

        [$base, $stdlib, $program].join("\n\n\n");
      }
    } else {
      die "Could not parse: {$input}";
    }
  }

  method page(--> Str) is export {
    "{$?FILE.IO.dirname}/html/index.html".IO.slurp;
  }
}
