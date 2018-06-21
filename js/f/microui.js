/*
 * Micro UI Framework
 */
 
function microUI(){
	var _app = {
		name: 'microUI',
		description: "This app contains some code which even the coder doesn't understand ;).",
		dom_container_obj: null
		services: [],
		rootWindow: null,
		windows: [],
		objects: []
	};
	var _themes = {//will define fully at last
		backgroundColor: 'black',
		windowCss:''
	};
	
	const defaultCssClasses = {
		uc_window:{name:'uc_window', definition:'.uc_window{border-radius:2px}'}
	};
	
	// attributes stored for any UI object
	var _ui_objects = {
		// level 1
		Window:{
			dom_obj: null,
			parent_obj: null,
			childObjects: null		// shall be initialized to new Map() object
		},
		//level 2
		TabGroup:{
			parent_obj: null
		},
		Tab:{
			parent_obj: null
		},
		ContextWindow:{
			parent_obj: null
		},
		//level 3
		MenuBar:{
			MenuItem:{
				Option:{
					parent_obj: null
				},
				parent_obj: null
			},
			parent_obj: null
		},
		ToolBar:{
			ToolBarItem:{
				parent_obj: null
			},
			parent_obj: null
		},
		Footer:{
			parent_obj: null
		},
		SessionMenuBar:{
			parent_obj: null
		}
		//level 4
		CanvasArea:{
			parent_obj: null
		},
		SVGArea:{
			parent_obj: null
		},
		//level 5
		InputField:{
			parent_obj: null
		},
		Button:{
			parent_obj: null
		},
		CheckButton:{
			parent_obj: null
		},
		DropDown:{
			parent_obj: null
		},
		DirectoryTree:{
			parent_obj: null
		},
		ContextMenu:{
			parent_obj: null
		},
		ProgressBar:{
			parent_obj: null
		},
		SearchBar:{
			parent_obj: null
		},
		DragBar:{
			parent_obj: null
		}
	};
	
	this.app = Object.freeze({
		//attribute getters
		getName: function(){ return _app.name; },
		getDescription: function() { return _app.description; },
		getContainerObj: function() { return _app.dom_container_obj; },
		//attribute setters
		setName: function(appName){ _app.name = appName; },
		setDescription: function(description) { _app.description = description; },
		//this will transfer the entire app to the new object passed (must be a div element or document object)
		setContainerObj: function(newContainerDiv) {
			newContainerDiv.innerHTML = _app.dom_container_obj.innerHTML;
			_app.dom_container_obj.innerHTML = '';
			_app.dom_container_obj = newContainerDiv;
		}
	});
	
	this.uiObjects = Object.freeze({
		
	});
	
	this.services = Object.freeze({
		add: function(){
		
		},
		remove: function(){
			
		},
		start: function(){
		
		},
		restart: function(){
			
		},
		pause: function(){
			
		},
		stop: function(){
			
		},
		ping: function(){
			
		},
		sendMessage: function(){
			// return true if service is ready to take any message, else false
		},
		getMessage: function(){
			// if addressed service has registered for giving respose on recieving a message,
			// then this function will wait(block) for the response, else return false immediately
		}
	});
	return Object.freeze(this);
}


/*
 * Following function is called when this script is used as a services manager
 * Not intended to be used directly by the end user
 */

function _services(callback, arguments){
	
}

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
