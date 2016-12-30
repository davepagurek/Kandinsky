use v6;

unit module Kandinsky::Node;

use JSON::Tiny;

role Value {
  #method type($context = Context.new) { ... }
}

class Definition {
  has Str $.name;
  has Value $.value;

  method to-code {
    "context.{$.name} = {$.value.to-code};";
  }
}

class Program {
  has Definition @.definitions;

  method to-code {
    @.definitions.map(*.to-code).join("\n\n");
  }
}

class String does Value {
  has Str $.content;

  method to-code {
    to-json($.content);
  }
}

class Number does Value {
  has Num $.content;

  method to-code {
    $.content.Str;
  }
}

class Dict does Value {
  has %.content = {};

  method to-code {
    '{' ~ %.content.pairs.map(-> $pair {
      to-json($pair.key) ~ ": " ~ $pair.value.to-code;
    }).join(', ') ~ '}';
  }
}

class Arr does Value {
  has @.content = [];

  method to-code {
    '[' ~ @.content.map(*.to-code).join(", ") ~ ']';
  }
}

class Function does Value {
  has Value $.subject;
  has Dict $.parameters = Dict.new;
  has Str $.name;

  method to-code {
    'compose(' ~
      ($.subject ?? $.subject.to-code !! "null") ~ ', ' ~
      "\"$.name\"" ~ ', ' ~
      $.parameters.to-code ~
    ')';
  }
}

class Nothing does Value {
  method to-code {
    "null";
  }
}
