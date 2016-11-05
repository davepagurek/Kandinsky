use v6;
use Kandinsky::AST; 

class Kandinsky::Actions {
  method TOP($/) {
    $/.make: Kandinsky::AST.new;
  }
}
