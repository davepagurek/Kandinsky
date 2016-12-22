use v6;
use Kandinsky::Node; 

class Kandinsky::Actions {
  method TOP($/) {
    make Kandinsky::Node::Program.new(
      definitions => $<definition>.map(*.made)
    );
  }

  method definition($/) {
    make Kandinsky::Node::Definition.new(
      name => $<identifier>.made,
      value => $<value>.made
    )
  }

  method identifier($/) {
    make $/.Str;
  }

  method value:sym<decorated>($/) {
    make reduce(-> $a, $b {
      Kandinsky::Node::Function.new(
        name => $b<identifier>.made,
        parameters => $b<dict> ?? $b<dict>.made !! Kandinsky::Node::Dict.new,
        subject => $a
      );
    }, $<function>.head.made, |($<function>.tail($<function>.elems - 1)));
  }

  method function($/) {
    make Kandinsky::Node::Function.new(
      name => $<identifier>.made,
      parameters => $<dict> ?? $<dict>.made !! Kandinsky::Node::Dict.new
    );
  }

  method value:sym<dict> {
    make $<dict>.made;
  }
  method dict($/) {
    make Kandinsky::Node::Dict.new(
      content => Hash.new($<pairlist>.made.list)
    );
  }
  method pairlist($/) {
    make $<pair>.map(*.made);
  }
  method pair($/) {
    make $<identifier>.made => $<value>.made;
  }

  method value:sym<array>($/) {
    make $<array>.made;
  }
  method array($/) {
    make Kandinsky::Node::Arr.new(
      content => $<arraylist>.made
    );
  }
  method arraylist($/) {
    make $<value>.map(*.made);
  }

  method value:sym<nothing>($/) {
    make Kandinsky::Node::Nothing.new;
  }

  method value:sym<number>($/) {
    make $<number>.made;
  }
  method number($/) {
    make Kandinsky::Node::Number.new(content => $/.Str.Num);
  }

  method value:sym<string>($/) {
    make $<string>.made;
  }
  method string($/) {
    make Kandinsky::Node::String.new(content => $/.str.map(*.made).join(""));
  }

  method str-double($/) {
    make $/.Str;
  }

  my %escaped = (
    '\\' => "\\",
    '/'  => "/",
    'b'  => "\b",
    'n'  => "\n",
    't'  => "\t",
    'f'  => "\f",
    'r'  => "\r",
    '"'  => "\""
  );
  method str-escape($/) {
    if $<utf16_codepoint> {
      make utf16.new( $<utf16_codepoint>.map({:16(~$_)}) ).decode();
    } else {
      make %escaped{~$/};
    }
  }
}
