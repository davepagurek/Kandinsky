# Kandinsky
A declarative language for programming generative art

<img src="https://github.com/davepagurek/Kandinsky/blob/master/branch.png?raw=true" width="200" />

## Purpose
Programming can contribute a lot to the art world by opening up possibilities for new types of creativity. Programmatically generated art can be responsive and interactive, and can use random generation to produce ever-changing works.

However, current creative languages like Processing <a href="http://worrydream.com/LearnableProgramming/#language">are not easily learnable</a> for people new to programming, which most artists are. For example, the "painter's algorithm" approach Processing uses for rendering (as well as most immediate-mode rendering systems) makes composable functions difficult to make. Global state must be modified in order to change the colour, which "leaks" out of the component and can affect other components.

Kandinsky aims to be a language based on coherent abstractions, using a declarative syntax to avoid having to worry about state mutations.

## Vision
### The future
Kandinsky will eventually have a GUI editor where one can use traditional vector drawing tools to create base objects, and then compose them with transformations and functions using a <a href="https://scratch.mit.edu">Scratch</a>-like block interface.

### Getting there
To start with, Kandinsky will be a written language, implemented in Perl 6, compiled to Javascript so that is can be displayed on the web and react to input events. 

Eventually, the compilation step should be moved to a compiled language (e.g. C) for integration with other libraries and possible runtime integration with OpenGL and existing vector graphics editing libraries. A GUI can then be added onto that.
