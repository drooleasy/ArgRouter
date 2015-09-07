# ArgRouter.js

is a small library that allows for clean javascript function overloading emulation with minimal overhead.

The idea is to create road based on signatures (sequences of types) associated with callback that affects some init object.
The main function body can then proceed that init object to do whatever job it has to (or to merge it to this in case of a constructor). 


The basic synopsis is this:

	var my_function = ArgRouter.decorate(
		{
			// bare/default init object
		},
		// a road (two numbers) and its callback
		"num,num",function(x,y){ // arguments are the signature parameters
			this.x = x; // this is the init object
			this.y = y;
		},
		// another road (for a 'pointish' object) and its callback
		"{x,y}", function(point){ // argument is the signature parameter
			this.x = point.x; // this is the init object
			this.y = point.y;
		},
		// the main part of the function 
		function my_function(ctx){ // argument is the inited object if a route was matched
			// do whatever you have to with the inited object (ctx)
			console.log(ctx.x);
			console.log(ctx.y);
		}
	);

my_function will now accepts argument in form of two numbers or an object with x and y properties and throw an error for everything else.

This also works for methods and constructors.

There's several base types, but you can add custom ones.

There's also a function to easy create combinations of signatures (ie two points defined either by two numbers or an object with x and y properties).

More doc to come. 
