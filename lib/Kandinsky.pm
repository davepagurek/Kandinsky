use v6;

use Kandinsky::Grammar;
use Kandinsky::Actions;
use Kandinsky::AST;

class Kandinsky {
  method run(Str $input --> Str) {
    my $match = Kandinsky::Grammar.subparse($input, actions => Kandinsky::Actions.new);
    if $match {
      if $match.to != $input.chars {
        die "Unexpected token: {$input.substr($match.to, *-1)}";
      } else {
        say $match;
        $match.gist;
      }
    } else {
      die "Could not parse: {$input}";
    }
  }
}
