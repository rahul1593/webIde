/*
 * Micro UI Framework
 */
 
function microUI(){
	this.name = 'microUI';
	this.description = "This app contains some code which even the coder doesn't understand ;).";
	this.dom_container_obj = null;
	
	var _theme = {//will define fully at last
		backgroundColor: 'black',
		windowCss:''
	};
	
	var _ui_objects = {
		window:{
			dom_obj: null,
			parent_obj: null,
			css: {position:'absolute',left:'0%',top:'0%',height:'100%',width:'100%'},
			
		},
		
	};
	
	this.getProperty = function(propName){
		
    };
	this.setProperty = function(propName, value){
		
	};
}

//const microUI = Object.freeze(new _microUI_Framework_Core());

/*
 * Following function is called when this script is used as a services manager
 * Not intended to be used directly by the end user
 */

function _services(callback, arguments){
	
}

u$ = microUI;








const _app = Object.freeze(_app);
/*
	Example for variables not available for modification to outsiders
*/
var getCode = (function() {
  var apiCode = '0]Eal(eh&2';    // A code we do not want outsiders to be able to modify...
  
  return function() {
    return apiCode;
  };
}());

getCode();    // Returns the apiCode

/*
	Spread operator example
*/
function f(x, y, z) { }
var args = [0, 1, 2];
f(...args);

/*
	Generators example
*/
function* idMaker() {
  var index = 0;
  while(true)
    yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

/*
	Proxy example
*/
const monster1 = {
  secret: 'easily scared',
  eyeCount: 4
};

const handler1 = {
  get: function(target, prop, receiver) {
    if (prop === 'secret') {
      return target[prop];
    } else {
      return Reflect.get(...arguments);
    }
  },
  set: function(obj, prop, value){
    value = 'not '+value;
    return Reflect.set(...arguments);
  }
};

const proxy1 = new Proxy(monster1, handler1);

console.log(proxy1.secret);
proxy1.secret = 'that easily ;(';
console.log(proxy1.secret);

/*
	hide attributes
*/
// import Events from 'eventemitter3';

const rawMixin = function () {
  const attrs = {};
  return Object.assign(this, {
    set (name, value) {
      attrs[name] = value;
      this.emit('change', {
        prop: name,
        value: value
      });
    },
    get (name) {
      return attrs[name];
    }
  }, Events.prototype);
};

const mixinModel = (target) => rawMixin.call(target);
const george = { name: 'george' };
const model = mixinModel(george);
model.on('change', data => console.log(data));
model.set('name', 'Sam');
/*
{
  prop: 'name',
  value: 'Sam'
}
*/
