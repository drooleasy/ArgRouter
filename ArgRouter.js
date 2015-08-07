
window = window || this;

ArgRouter.is_numeric = function (n){
	return !isNaN(parseFloat(n)) && isFinite(n);	
}


ArgRouter.parseSignature = function (signature){
	signature = signature.replace(/\(|\)|\s+/gmi, "");
	var typesRaw = signature.split(","),
		types = [];
	
	for(var i=0; i<typesRaw.length; i++){
		var type = typesRaw[i];
		////console.log("add type : " + type)
		if(type != "") types.push(type); 
	}
	return types;
}

ArgRouter.parseType = function (t){

	var props = t.split(/\./gmi)
	t=props[0];
	
	var prop_condition = function testProperties(v, t){
		for(var i=1; i<props.length; i++){
			var prop = props[i];
			if(v[prop] == null || v[prop] == undefined){
				return false;
			}
		};
		return true;
		
	};


	if(!t) return function testNoParameter(v){ console.log("test no param"); return v === undefined};

	var type_condition = null;
	if(t=="any") type_condition = ArgRouter.testAnyParameter;
	else if(t=="fun") type_condition = ArgRouter.testFunParameter;
	else if(t=="num") type_condition = ArgRouter.testNumParameter;
	else if(t=="str") type_condition = ArgRouter.testStrParameter;
	else if(t=="bool") type_condition = ArgRouter.testBoolParameter;
	else if(t=="obj") type_condition = ArgRouter.testObjParameter;
	else if(t=="arr") type_condition = ArgRouter.testArrParameter;
	else type_condition = ArgRouter.testCustomTypeParameter;
	
	
	return function testParameter(v){
		return type_condition(v, t) && prop_condition(v, t);
	}
}


ArgRouter.testAnyParameter = function testAnyParameter(v, t){return true}
ArgRouter.testFunParameter = function testFunParameter(v, t){return typeof v == "function"}
ArgRouter.testNumParameter = function testNumParameter(v, t){return typeof v == "number"}
ArgRouter.testStrParameter = function testStrParameter(v, t){return typeof v == "string"}
ArgRouter.testBoolParameter = function testBoolParameter(v, t){return typeof v == "boolean"}
ArgRouter.testObjParameter = function testObjParameter(v, t){return typeof v == "object"}
ArgRouter.testArrParameter = function testArrParameter(v, t){return ArgRouter.is_numeric(v.length)}
ArgRouter.testCustomTypeParameter = function testCustomTypeParameter(v, t){return v instanceof window[t]}


function ArgRouter(){
	var signatures = [];
	var callbacks = [];
	var validators = [];
	var rule_length_index = [];
	this.add = function(signature, callback){
		//console.log("adding " + signature)
		var next = this.length();
		var parsed = ArgRouter.parseSignature(signature)
		signatures[next] = parsed;
		if(!rule_length_index[parsed.length]) rule_length_index[parsed.length] = [];
		
		rule_length_index[parsed.length].push(next);
		
		callbacks[next] = callback;
		
		
		(function(parsed){
			var argValidate = [];
			
			for(var i=0; i<parsed.length; i++){
				argValidate[i] = ArgRouter.parseType(parsed[i]);
			}
			
			var validate = function(args){
				var i=0;
				for(; i<args.length; i++){
					if(!argValidate[i](args[i])) return false;
				}
				return i==args.length
			}
			validators.push(validate);
		})(parsed)
		
	};
	this.rule = function(i){
		if(i<0 || i>=this.length) throw new Error("out of bounds")
		//console.log("rule #"+i);
		//console.log(signatures[i]);
		return {
			signature: signatures[i],
			callback: callbacks[i],
			validate: validators[i],
		}
	};
	this.candidates = function(num_args){
		var res = [];
		//for(var i=num_args; i<rule_length_index.length; i++){
			if(rule_length_index[num_args]) res = rule_length_index[num_args].splice(0);
		//}
		return res;
	}

	this.length = function(){
		return signatures.length;
	};
}

ArgRouter.prototype.route = function(ctx, args){
	ctx = ctx || {};
	var l = args.length
	var possibles = this.candidates(l);
		
	for(var i=0; i<possibles.length; i++){
		var rule_index = possibles[i];
		if(this.rule(rule_index).validate(args)){
			this.rule(rule_index).callback.apply(ctx, args);
			return true;
		}
	
	}
	return false;
}

ArgRouter.prototype.combine = function(/* hash... */){
  var combs = {};
  var combs_args = {};
  for(var prop in arguments[0]){
    combs[prop] = [arguments[0][prop]];
    combs_args[prop] = [prop];
 }
  for(var i=1;i<arguments.length;i++){
    var newCombs = {};
    var newCombs_args = {};
    for(var prop in arguments[i]){
		  for(var old in combs){
				var neo = old;
				if(prop) neo+=","
				neo += prop
				newCombs[neo] = combs[old].concat(arguments[i][prop]);
				newCombs_args[neo] = combs_args[old].concat([prop]);
		  }
    }
    combs = newCombs;
    combs_args = newCombs_args;
  }
  for(var old in combs){
	var cb =(function(combs, key){
		
		var cbs = combs[key];
		var cbs_args = combs_args[key];
		var subsignatures_length = [];
		for(var i=0;i<cbs_args.length;i++){
			var subsignature = ArgRouter.parseSignature(cbs_args[i]);
			subsignatures_length.push(subsignature.length)
		}
		return function(){
			var argdex = -1;
			for(var i=0;i<cbs_args.length;i++){
				var sub_length = subsignatures_length[i];
				var arg = [];
				for(j=0; j<sub_length; j++){
					argdex++;
					arg.push(arguments[argdex])
				}	
				cbs[i].apply(this, arg);
			}
		}
	})(combs, old);
	combs[old] = cb
  }
  
  
	for(var old in combs){
		//console.log("add " + old);
		this.add(old, combs[old]);
	}
   
  //return combs;
}

