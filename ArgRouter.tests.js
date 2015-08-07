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
