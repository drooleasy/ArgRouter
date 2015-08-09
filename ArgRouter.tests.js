function testCombine(){
		var ctx = {};
		
		//for(var i=0;i<1000;i++)router.route(ctx, arguments);
		if(!testCombine.router.route(ctx, arguments)) console.log("no route found 1"); else console.log("found route 1");
		if(!testCombine.router.route(ctx, arguments)) console.log("no route found 2"); else console.log("found route 2");
}

testCombine.router = new ArgRouter();
var hash1 = {
	"num":function(num){
		console.log("num " + num); 
	},
	"bool,bool":function(b,b2){
		console.log("bool " + b);
		console.log("bool " + b2);
	}
}
var hash2 = {
	"arr":function(arr){
		console.log("arr " + arr); 
	},
	"obj":function(o){
		console.log("o " + o); 
	}
}

var hash3 = {
	"":function(){
		console.log("no arg cb"); 
	},
	"num":function(num){
		console.log("num " + num); 
	}
}

testCombine.router.combine(hash1, hash2, hash3);


function test(){
	var router = new ArgRouter();
	router.add("()", function(){console.log("empty args")})
	router.add("(num)", function(){console.log("one num")})
	router.add("(num,num)", function(){console.log("two num")})
	router.add("(num, obj)", function(){console.log("one num and one obj")})
	router.add("(num,num, obj)", function(){console.log("two num and one obj")})
	router.add("(num,num, arr)", function(){console.log("two num and one obj")})
	
	if(!router.route(this, arguments)){
		console.log("no route found")
	}
}


function testDecorator(){
	
	var test = ArgRouter.decorate(
		{a:null,b:null},
		"(num)", 		function(a){this.a=a;console.log("one num")},
		"(num,num)", 	function(a,b){this.a=a;this.b=b;console.log("two num")},
		"(bool,bool)", 	function(a,b){this.a=a;this.b=b;console.log("two bool")},
		function test(ctx){
			console.log("test called");
			console.log(ctx);
		}
	);
	test(true, false);
	console.log("decorated " + test.name)
}


function testDecoratorConstructor(){
	
	var Test = ArgRouter.decorate(
		// init
		{	
			a: null,
			b: null
		},
		// signatures
		"()", function(a){ 
			this.a = -1;
			this.b = -1;
			console.log("no arg") ;
		},
		"(num)", function(a){ 
			this.a=a; 
			console.log("one num") ;
		},
		"(num, num)", function(a,b){ 
			this.a=a; 
			this.b=b; 
			console.log("two num"); 
		},
		"(bool, bool)", 	function(a,b){ 
			this.a=a; 
			this.b=b; 
			console.log("two bool") 
		},
		// ctor
		function Test(ctx){
			if(ctx){
				console.log("Test called");
				console.log(ctx);
				ctx.__merge__(this);
			}
		}
	);
	var t = new Test();
	// member
	Test.prototype.myMethod = function(){console.log("myMethod called"); console.log("this");console.log(this)}
	console.log(t)
	console.log("is instance of Test " + (t instanceof Test))
	console.log("proto " + Test.prototype)
	console.log("proto ctor " + Test.prototype.constructor)
	console.log("ctor " + t.constructor)
	//console.log("decorated " + t.constructor)
	console.log("name " + Test.name)
	t.myMethod();
	// ctor routes
	console.log(Test.__routes__.join(",\n"))
}



function testDecoratorMethod(){
	function Ctor(){}
	Ctor.prototype.test = ArgRouter.decorate(
		{a:null,b:null},
		"(num)", 		function(a){this.a=a;console.log("one num")},
		"(num,num)", 	function(a,b){this.a=a;this.b=b;console.log("two num")},
		"(bool,bool)", 	function(a,b){this.a=a;this.b=b;console.log("two bool")},
		function test(ctx){
			console.log("test called");
			console.log(ctx);
			console.log("instance of Ctor: " + (this instanceof Ctor))
		}
	);
	var c = new Ctor();
	c.test();
	console.log("decorated " + c.test.name)
}

