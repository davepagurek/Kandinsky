use v6;

grammar Kandinsky::Grammar {
  rule TOP {
    <.ws>
    <definition> *
    <.ws>
  }

  rule definition {
    "define" <identifier> "as" <value> <end-stmt>
  }

  rule function {
    <identifier> [ ":" <dict> ]?
  }

  rule dict {
    '{' ~ '}' <pairlist>
  }

  rule pairlist {
    <pair> * % \,
  }

  rule pair {
    <identifier> ':' <value>
  }

  rule array {
    '[' ~ ']' <arraylist>
  }

  rule arraylist {
    <value> * % [ \, ]
  }

  proto rule value {*}
  rule value:sym<decorated> {
    <function> + % [ <compose> ]
  }
  rule value:sym<number> {
    <number>
  }
  rule value:sym<string> {
    <string>
  }
  rule value:sym<dict> { <dict> }
  rule value:sym<array> { <array> }

  token number {
    '-'? \d+ \.? \d*
  }


  # Strings
  token string {
    \" [ <str-double> | \\ <str=.str-escape> ]* \"
  }
  token str-double {
    <-["\\\t\n]>+
  }
  token str-escape {
    <['"\\/bfnrt]> | 'u' <utf16-codepoint>+ % '\u'
  }
  token utf16-codepoint {
    <.xdigit>**4
  }


  # Terminals

  token compose {
    \;
  }

  token end-stmt {
    \.
  }

  token identifier {
    <:Letter> \w*
  }
}
