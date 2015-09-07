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
		"num,num",function(x,y){
			this.x = x; // this is the init object
			this.y = y;
		},
		// another road (for a 'pointish' object) and its callback
		"{x,y}", function(point){
			this.x = point.x; // this is the init object
			this.y = point.y;
		},
		// the main part of the function 
		function(ctx){
			// do whatever you have to with the inited object
			console.log(ctx.x);
			console.log(ctx.y);
		}
	);

There's several bas type, but you can add custom ones.

There's also a fonction to easy create combinations of signatures (ie two points defined either by two numbers or an object with x and y properties).

More doc to come. 
