/*
 * @geekubuntu
 * Author: Rahul Bhartari
 */
console = null;
function print(text){
    console.innerHTML = console.innerHTML+text.toString();
}
u$ = {
    App:{
       Name:null,
       Services:[],
       RootWindow:null,
       Windows:[],
       Objects:[],
       TabGroups:[],
       getWindowById: function(id){
           return u$.System.Library.Utility.searchPropertyInObjList(u$.App.Windows, 'id', id);
       },
       getObjectById: function(id){
           return u$.System.Library.Utility.searchPropertyInObjList(u$.App.Objects, 'id', id);
       },
       getObjectByObj: function(obj){
           for(var i=0;i<u$.App.Objects.length;i++){
               if(obj === u$.App.Objects[i].obj){
                   return u$.App.Objects[i];
               }
           }return null;
       }
    },
    Classes:{
        Window: function(){
            this.obj = null;
            this.id = null;
            this.parentObj = null;
            this.css = null;
            this.minWidth = null;
            this.minHeight = null;
        },
        Object: function(){
            this.obj = null;
            this.id = null;
            this.parentObj = null;
            this.minWidth = null;
            this.minHeight = null;
        },
        Service: function(name, callback, state){
            this.name = name;
            this.callback = callback;
            this.state = state;     //can be one of ('running','stopped')
        }
    },
    System:{
        Services:{
            __data:{
                frequency:10,               //millisecond
                registered_services:[],     //list of services,
                crnt_srv_indx:0,
                timerObj:null
            },
            __exec: function(){
                if(u$.System.Services.__data.registered_services.length < 1){
                    return;
                }
                var srv = u$.System.Services.__data.registered_services[u$.System.Services.__data.crnt_srv_indx];
                if(srv.state === 'running'){
                    setTimeout(srv.callback,1);
                }
                u$.System.Services.__data.cnt_srv_indx++;
                if(u$.System.Services.__data.crnt_srv_indx >= u$.System.Services.__data.registered_services.length){
                    u$.System.Services.__data.cnt_srv_indx = 0;
                }
            },
            resetServices: function(){
                //this function removes all the services from the list of running services and resets the timer
                u$.System.Services.__data = {
                    frequency:10,
                    registered_services:[],
                    crnt_srv_indx:0,
                    timerObj:null
                };
            },
            setServiceFrequency: function(delay_ms){
                clearInterval(u$.System.Services.__data.timerObj);
                u$.System.Services.__data.timerObj = setInterval(u$.System.Services.__exec, delay_ms);
                u$.System.Services.__data.frequency = delay_ms;
            },
            addService: function(service){
                if(service.hasOwnProperty('name') && service.hasOwnProperty('callback') && service.hasOwnProperty('state')) {
                    u$.System.Services.__data.registered_services[u$.System.Services.__data.registered_services.length] = service;
                    if(service.state !== 'running' && service.state !== 'stopped'){
                        return false;
                    }
                    return true;
                }
                return false;
            },
            removeService: function(service_name){
                for(var i=0; i<u$.System.Services.__data.registered_services.length;i++){
                    if(u$.System.Services.__data.registered_services[i].name === service_name){
                        u$.System.Services.__data.registered_services.splice(i,1);  //remove the element at matched index
                        return true;
                    }
                }
                return false;
            },
            __srv_action: function(srv_name, state){
                for(var i=0; i<u$.System.Services.__data.registered_services.length;i++){
                    if(u$.System.Services.__data.registered_services[i].name === srv_name){
                        u$.System.Services.__data.registered_services[i].state = state;
                        return true;
                    }
                }return false;
            },
            startService: function(service_name){
                u$.System.Services.__srv_action(service_name, 'running');
            },
            stopService: function(service_name){
                u$.System.Services.__srv_action(service_name, 'stopped');
            },
            getServiceList: function(){
                var srv_list = [];
                for(var i=0; i<u$.System.Services.__data.registered_services.length;i++){
                    srv_list[srv_list.length] = u$.System.Services.__data.registered_services[i].name;
                }
                return srv_list;
            },
            getServicesInState: function(state){
                var srv_list = [];
                for(var i=0; i<u$.System.Services.__data.registered_services.length;i++){
                    if(u$.System.Services.__data.registered_services[i].state === state){
                        srv_list[srv_list.length] = u$.System.Services.__data.registered_services[i].name;
                    }
                }
                return srv_list;
            }
        },
        Library:{
            Action:{
                __data:{
                    dragging:false,
                    dragHandle:null,
                    hx:null,
                    vy:null
                },
                onMenubarItemClick: function(){
                    
                },
                __dragStart: function(e){
                    e.preventDefault();
                    u$.System.Library.Action.__data.dragging = true;
                },
                __dragEnd: function(e){
                    if(u$.System.Library.Action.__data.dragging){
                        document.body.removeEventListener('mousemove', u$.System.Library.Action.__data.dragHandle, false);
                        u$.System.Library.Action.__data.dragging = false;
                    }
                },
                __horizontalDragAction: function(e, bar, leftObjList, rightObjList){
                    var cx, w, left_left_list = [];
                    var min_width = 0, f=0;        //minimum width of any window which is getting shrinked, if not set
                    var right_left_list = [], right_width_list = [];
                    //get the current position data
                    for(var i=0;i<leftObjList.length;i++){
                        var obj_cstyle = window.getComputedStyle(leftObjList[i].obj);
                        cx = parseInt(obj_cstyle.width.split('px')[0], 10);
                        w = cx;
                        cx = obj_cstyle.minWidth;
                        if(cx === 'auto' || cx === '0px'){
                            if(leftObjList[i].minWidth != null){
                                if(min_width<leftObjList[i].minWidth){
                                    min_width = leftObjList[i].minWidth;
                                }
                            }
                            if(w <= min_width){
                                f=1;
                            }
                        }else{
                            if(w <= parseInt(cx.split('px')[0], 10)){
                                f=1;
                            }
                        }
                        //get left offset
                        cx = obj_cstyle.left;
                        if(cx === 'auto'){
                            cx = parseInt(obj_cstyle.right.split('px')[0], 10);
                            left_left_list[i] = cx-w;
                        }else{
                            left_left_list[i] = parseInt(cx.split('px')[0], 10);
                        }
                    }
                    min_width = 0;
                    for(i=0;i<rightObjList.length;i++){
                        obj_cstyle = window.getComputedStyle(rightObjList[i].obj);
                        cx = parseInt(obj_cstyle.width.split('px')[0], 10);
                        right_width_list[i] = cx;
                        cx = obj_cstyle.minWidth;
                        if(cx === 'auto' || cx === '0px'){
                            if(rightObjList[i].minWidth != null){
                                if(min_width<rightObjList[i].minWidth){
                                    min_width = rightObjList[i].minWidth;
                                }
                            }
                            if(right_width_list[i] <= min_width){
                                f=-1;
                            }
                        }else{
                            if(right_width_list[i] <= parseInt(cx.split('px')[0], 10)){
                                f=-1;
                            }
                        }
                        //get the left offset
                        cx = obj_cstyle.left;
                        if(cx == 'auto'){
                            cx = parseint(obj_cstyle.right.split('px')[0], 10);
                            right_left_list[i] = cx-right_width_list[i];
                        }else{
                            right_left_list[i] = parseInt(cx.split('px')[0], 10);
                        }
                    }
                    cx = (window.Event) ? e.pageX : event.clientX;
                    var p_delta, pd_style = window.getComputedStyle(bar.parentObj);
                    p_delta = pd_style.left;
                    if(p_delta === 'auto'){
                        p_delta = parseInt(pd_style.right.split('px')[0], 10) - parseInt(pd_style.width.split('px')[0], 10);
                    }else{
                        p_delta = parseInt(p_delta.split('px')[0], 10);
                    }
                    cx = cx-p_delta;
                    if(f>0 && u$.System.Library.Action.__data.hx>=cx){
                        return;
                    }else{
                        if(f<0 && u$.System.Library.Action.__data.hx<=cx){
                            return;
                        }
                    }
                    u$.System.Library.Action.__data.hx = cx;
                    //set the widths of left objects
                    for(i=0;i<leftObjList.length;i++){
                        leftObjList[i].obj.style.width = (cx-left_left_list[i]).toString()+'px';
                    }
                    bar.obj.style.left = cx.toString()+'px';
                    //set the lefts & widths of right objects
                    for(i=0;i<rightObjList.length;i++){
                        rightObjList[i].obj.style.left = (cx+2).toString()+'px';
                        rightObjList[i].obj.style.width = (right_width_list[i]-(cx+2-right_left_list[i])).toString()+'px';
                    }
                },
                __horizontalDragStart: function(e, bar, leftObjList, rightObjList){
                    u$.System.Library.Action.__dragStart(e);
                    u$.System.Library.Action.__data.dragHandle = function(e){
                        u$.System.Library.Action.__horizontalDragAction(e, bar, leftObjList, rightObjList);
                        if(u$.App.TabGroups.length>0){
                            u$.App.TabGroups[0].resizeTabHead();
                        }
                    };
                    document.body.addEventListener('mousemove', u$.System.Library.Action.__data.dragHandle, false);
                },
                __verticalDragAction: function(e, bar, topObjList, bottomObjList){
                    var cy, h, top_top_list = [];
                    var min_height = 0, f=0;       // minimum height of any window which is getting shrinked, if not set
                    var bottom_top_list = [], bottom_height_list = [];
                    //get the data
                    for(var i=0;i<topObjList.length;i++){
                        var obj_cstyle = window.getComputedStyle(topObjList[i].obj);
                        cy = parseInt(obj_cstyle.height.split('px')[0], 10);
                        h = cy;
                        cy = obj_cstyle.minHeight;
                        if(cy === 'auto' || cy === '0px'){
                            if(topObjList[i].minHeight != null){
                                if(min_height<topObjList[i].minHeight){
                                    min_height = topObjList[i].minHeight;
                                }
                            }
                            if(h <= min_height){
                                f=1;
                            }
                        }else{
                            if(h <= parseInt(cy.split('px')[0], 10)){
                                f=1;
                            }
                        }
                        //get top offset
                        cy = obj_cstyle.top;
                        if(cy === 'auto'){
                            cy = parseInt(obj_cstyle.bottom.split('px')[0], 10);
                            top_top_list[i] = cy-h;
                        }else{
                            top_top_list[i] = parseInt(cy.split('px')[0], 10);
                        }
                    }
                    min_height = 0;
                    for(i=0;i<bottomObjList.length;i++){
                        obj_cstyle = window.getComputedStyle(bottomObjList[i].obj);
                        cy = parseInt(obj_cstyle.height.split('px')[0], 10);
                        bottom_height_list[i] = cy;
                        
                        cy = obj_cstyle.minHeight;
                        if(cy === 'auto' || cy === '0px'){
                            if(bottomObjList[i].minHeight != null){
                                if(min_height<bottomObjList[i].minHeight){
                                    min_height = bottomObjList[i].minHeight;
                                }
                            }
                            if(bottom_height_list[i] <= min_height){
                                f=-1;
                            }
                        }else{
                            if(bottom_height_list[i] <= parseInt(cy.split('px')[0], 10)){
                                f=-1;
                            }
                        }
                        //get top offset
                        cy = obj_cstyle.top;
                        if(cy === 'auto'){
                            cy = parseInt(obj_cstyle.bottom.split('px')[0], 10);
                            bottom_top_list[i] = cy - bottom_height_list[i];
                        }else{
                            bottom_top_list[i] = parseInt(cy.split('px')[0], 10);
                        }
                    }
                    cy = (window.Event) ? e.pageY : event.clientY;
                    var p_delta, pd_style = window.getComputedStyle(bar.parentObj);
                    p_delta = pd_style.top;
                    if(p_delta === 'auto'){
                        p_delta = parseInt(pd_style.bottom.split('px')[0], 10) - parseInt(pd_style.height.split('px')[0], 10);
                    }else{
                        p_delta = parseInt(p_delta.split('px')[0], 10);
                    }
                    cy = cy-p_delta;
                    if(f>0 && u$.System.Library.Action.__data.vy>=cy){
                        return;
                    }else{
                        if(f<0 && u$.System.Library.Action.__data.vy<=cy){
                            return;
                        }
                    }
                    u$.System.Library.Action.__data.vy = cy;
                    // set top objects heights
                    for(i=0;i<topObjList.length;i++){
                        topObjList[i].obj.style.height = (cy-top_top_list[i]).toString()+'px';
                    }
                    bar.obj.style.top = cy.toString()+'px';
                    //set top and heights of objects on bottom sise of dragbar
                    for(i=0;i<bottomObjList.length;i++){
                        bottomObjList[i].obj.style.top = (cy+2).toString()+'px';
                        bottomObjList[i].obj.style.height = (bottom_height_list[i] - (cy+2-bottom_top_list[i])).toString()+'px';
                    }
                },
                __verticalDragStart: function(e, bar, topObjList, bottomObjList){
                    u$.System.Library.Action.__dragStart(e);
                    u$.System.Library.Action.__data.dragHandle = function(e){
                        u$.System.Library.Action.__verticalDragAction(e, bar, topObjList, bottomObjList);
                    };
                    document.body.addEventListener('mousemove', u$.System.Library.Action.__data.dragHandle, false);
                },
                __menuItemHover: function(e, contextMenu){
                    if(u$.System.Library.Gui.__data.itemClicked){
                        u$.System.Library.Gui.__data.closeAllContextWindows(e);
                        u$.System.Library.Gui.__data.itemClicked = true;
                        contextMenu.setDisplay(true);
                    }
                },
                __menuOptionHover: function(e, contextMenu){
                    u$.System.Library.Gui.__data.closeOptionAllContextWindows(e);
                    if(contextMenu !== null){
                        contextMenu.setDisplay(true);
                    }
                }
            },
            Gui:{
                Classes:{
                    general:'$menuBarBackground: #444444;\n',
                    window: '.uc_window{border-radius:2px}',
                    menuBarItem: '.uc_menuBarItem{font-size:10px;padding-left:2px;padding-right:2px;outline:none;cursor:context-menu}\n\
                                    .uc_menuBarItem:hover,.uc_menuBarItem:active\n\
                                    {border:1px solid #cccccc}',
                    menuItemOption: '.uc_menuItemOption{background-color:#eeeeee;font-size:10px}\n\
                                    .uc_menuItemOption:hover,.uc_menuItemOption:active{background-color:white;cursor:context-menu}',
                    icon: '.uc_icon{display:inline-block;border:1px solid #cccccc}\n.uc_icon:hover,.uc_icon:active{border:1px solid white}',
                    icon2: '.uc_icon2{display:inline-block;border:1px solid white}\n.uc_icon2:hover,.uc_icon2:active{border:1px solid black}',
                    hDragBar: '.uc_hDragBar{}\n.uc_hDragBar:hover,.uc_hDragBar:active{cursor:row-resize}',
                    vDragBar: '.uc_vDragBar{}\n.uc_vDragBar:hover,.uc_vDragBar:active{cursor:col-resize}',
                    toolsGroup: '.uc_toolsGroup{position:relative;top:0px;bottom:1px;display:inline;\n\
                                min-width:10px;margin:0px 1px 0px 1px;float:left;border:1px solid #999999;border-radius:2px;}',
                    toolsGroupDragger: '.uc_toolsDragger{height:24px;width:5px;background-color:#eeeeee;border:none;margin:2px 0px 2px 0px;float:left;}\n\
                                .uc_toolsDragger:hover{cursor:move}',// t r b l
                    button: '.uc_button{text-align:center;margin:0;padding:4px 8px 4px 8px;border-radius:4px;border:1px solid #eeeeee;background-color:#dddddd;box-shadow: 0px 0px 5px 0px #eeeeee;}\n\
                             .uc_button:hover{cursor:pointer;border:1px solid #9999ff;background-color:#e1e1e1;}',
                    close: '.uc_close{border:1px solid transparent} .uc_close:hover{border:1px solid black}'
                },
                __data:{
                    itemClicked: false,
                    menuItemList: [],
                    contextWinOwnerOptionList: [],
                    toolBar: null,
                    getMenuItemByText: function(text){
                        return u$.System.Library.Utility.searchPropertyInObjList(u$.System.Library.Gui.__data.menuItemList, 'text', text);
                    },
                    closeAllContextWindows: function(e){
                        var f=0,i;
                        var menu = u$.System.Library.Gui.__data.menuItemList;
                        var evt = window.event || e || event;
                        var target = evt.target;
                        for(i=0;i<menu.length;i++){
                            menu[i].obj.style.backgroundColor = '#eeeeee';
                            if(menu[i].contextMenu !== null){
                                if(target !== menu[i].obj){
                                    if(!menu[i].contextMenu.obj.contains(target)){
                                        menu[i].contextMenu.setDisplay(false);
                                        menu[i].obj.style.backgroundColor = '#cccccc';
                                        menu[i].contextMenu.obj.style.backgroundColor = '#cccccc';
                                    }else{
                                        f=2;
                                    }
                                }else{      //need a better solution ***** behaving differently in chrome & firefox
                                    f=1;
                                }
                            }
                        }
                        if(f === 0){
                            u$.System.Library.Gui.__data.itemClicked = false;
                            
                        }else if(f === 2){
                            u$.System.Library.Gui.__data.itemClicked = true;
                        }
                    },
                    closeOptionAllContextWindows: function(e){
                        var opts = u$.System.Library.Gui.__data.contextWinOwnerOptionList;
                        var evt = window.event || e || event;
                        for(var i=0;i<opts.length;i++){
                            if(!opts[i].contextMenu.obj.contains(evt.target)){
                                opts[i].contextMenu.setDisplay(false);
                            }else{
                                var pCntx = opts[i].parentContext;
                                while(pCntx.itemIsOption){
                                    pCntx.setDisplay(true);
                                    pCntx = pCntx.boundItemObj.parentContext;
                                }pCntx.setDisplay(true);
                                pCntx.boundItemObj.style.backgroundColor = '#eeeeee';
                                u$.System.Library.Gui.__data.itemClicked = true;
                            }
                        }
                    }
                },
                Objects:{
                    //menubar components
                    menuBar: {
                        obj: null,
                        parentObj: null,
                        backgroundColor: '#cccccc',
                        itemList: []
                    },
                    menuItem: function(){
                        this.id = null;
                        this.obj = null;
                        this.text = null;
                        this.contextMenu = null;    //menuContextWindow object
                        this.backgroundColor= '#cccccc';
                        this.onclick = function(e){
                            var evt = e || window.event || event;
                            if(this.contextMenu !== null){
                                this.contextMenu.setDisplay(!this.contextMenu.displayStatus);
                                u$.System.Library.Gui.__data.itemClicked = this.contextMenu.displayStatus;
                                this.obj.style.backgroundColor = '#eeeeee';
                            }
                        };
                    },
                    menuContextWindow: function(){
                        this.id = null;
                        this.obj = null;        //this is a table
                        this.boundItemObj = null;   //this is option or menu item
                        this.itemIsOption = false;
                        this.options = [];   //contains a list of menuItemOption objects
                        this.width = 130;       //width in pixels
                        this.displayStatus = false;
                        this.backgroundColor = '#eeeeee';
                        this.setDisplay = function(status){ //true or false
                            this.displayStatus = status;
                            if(status){
                                this.obj.style.display = 'inline-block';
                                if(!this.itemIsOption){
                                    this.boundItemObj.style.border = '1px solid black';
                                }
                                return true;
                            }
                            this.obj.style.display = 'none';
                            if(!this.itemIsOption){
                                this.boundItemObj.style.border = '1px solid #cccccc';
                            }
                        };
                        this.setWidth = function(w){
                            this.width = w;
                            this.obj.style.width = w.toString()+'px';
                        };
                    },
                    menuItemOption: function(){
                        this.id = null;
                        this.parentObj = null;      //this is container table
                        this.obj = null;            //this is a table row
                        this.iconObj = null;
                        this.textObj = null;
                        this.directorDivObj = null;
                        var optionHeight = 12;     //height of the option
                        this.onclick = null;
                        this.contextMenu = null;
                        this.parentContext = null;
                        this.setHeight = function(height){
                            optionHeight = height;
                        };
                        this.getHeight = function(){
                            return optionHeight;
                        };
                        this.addSvgIcon = function(svgIconName){
                            this.iconObj.innerHTML = '<i class="'+svgIconName+'"></i>';
                        };
                        this.addImageIcon = function(path){
                            this.iconObj.innerHTML = '<img alt="icon" src="'+path+'" style="height:100%;width:100%;"></img>';
                        };
                    },
                    //toolbar components
                    toolBar: function(parentWin){
                        this.id = null;
                        this.obj = parentWin.obj;
                        this.parentObj = parentWin.obj.parentElement;
                        this.availableWidth = window.getComputedStyle(parentWin.obj).width-50;  //populated when initialized, update when toolsGroup is added
                        this.toolsGroupList = [];    //list of tool groups
                        this.addToolsGroup = function(tg_obj){
                            if(tg_obj.width > this.availableWidth){
                                return false;
                            }
                            this.toolsGroupList[this.toolsGroupList.length] = tg_obj;
                            this.obj.appendChild(tg_obj.obj);
                            this.availableWidth -= tg_obj.width;
                            return true;
                        };
                        this.removeToolsGroup = function(tg_id){
                            var cto = u$.System.Library.Gui.Objects.toolBar;
                            if(cto.toolsGroupList.length<1){
                                return false;
                            }
                            var i = u$.System.Library.Utility.searchPropertyInObjList(cto, id, tg_id);
                            cto.availableWidth += cto.toolsGroupList[i].width;
                            cto.toolsGroupList.splice(i,1);
                            return true;
                        };
                    },
                    toolsGroup: function(){
                        this.id = null;
                        this.obj = null;
                        this.draggerObj = null;
                        this.contDivObj = null;
                        this.parentToolBar = null;
                        this.height = 28;           //height in pixels
                        this.width = 5;            //width in pixels, updated when any item is added
                        this.itemList = [];        //list of tools with icons
                        this.addItem = function(itemObj){
                            
                        };
                    },
                    toolsGroupDragger: function(){
                        this.id = null;
                        this.obj = null;
                        this.height = 14;           //height in pixels
                        this.ondrag = function(e){
                            //i don't know
                        };
                    },
                    //different types of UI elements
                    inputBox: function(){
                        this.id = null;
                        this.obj = null;
                        this.parentObj = null;
                        this.height = 15;   //in pixels
                        this.width = 30;
                        this.type = 'text'; //can be text, number, date
                        this.placeholderText = 'Enter Here';
                        this.validate = null;   //validator function
                    },
                    button: function(){
                        this.id = null;
                        this.obj = null;
                        this.parentObj = null;
                        this.height = 20;   //in pixels
                        this.width = 40;
                        this.iconSide = 20;
                        this.type = 'text'; //can be text, icon
                        this.iconType = 'svg';  //can be one of svg or png
                        this.iconObj = null;   //img/div object
                        this.text = 'Submit';
                        this.backgroundColor='#eeeeee';
                        this.color = '#222222';
                        this.setHeightWidth = function(h, w){
                            this.obj.style.height = h+'px';
                            this.obj.style.width = w+'px';
                            this.height = h;
                            this.width = w;
                        };
                    },
                    inputButtonGroup: function(){
                        this.id = null;
                        this.obj = null;
                        this.parentObj = null;
                        this.height = 15;   //in pixels
                        this.width = 20;
                        this.type = 'radio';    //one of radio, checkbox or selection
                        this.iconUnselected = null;
                        this.iconSelected = null;
                        this.optionObjList = [];
                        this.onSelect = function(){
                            
                        };
                        this.onUnSelect = function(){
                            
                        };
                    },
                    dropDown: function(){
                        this.id = null;
                        this.obj = null;
                        this.parentObj = null;
                        this.height = 20;   //in pixels
                        this.width = 80;
                        this.fontSize=10;
                        this.iconObj = null;   //div/img object
                        this.iconType = 'png';  //one of svg or png
                        this.dropDownType = 'context';  //cna be one of context or select
                        this.visibleValue = null;
                        this.dropDownMenu = null;   //contextMenu object or custom object
                        this.optionGroupObjList = [];   //if option group is used
                        this.onclick = function(e){
                            //
                        };
                        this.setClickAction = function(handler){
                            this.onclick = function(e){
                                oclk(e);
                                handler(e);
                            };
                        };
                        this.setSvgIcon = function(icon_name){
                            
                        };
                        //functions for text options
                        this.addOptionGroup = function(label){
                            var optg = document.createElement('optgroup');
                            optg.label = label;
                            this.obj.appendChild(optg);
                            this.optionGroupObjList[this.optionGroupObjList.length] = optg;
                            return optg;
                        };
                        this.removeOptionGroup = function(label){
                            for(var i=0;i<this.optionGroupObjList.length;i++){
                                if(this.optionGroupObjList[i].label === label){
                                    this.obj.removeChild(this.optionGroupObjList[i]);
                                    this.optionGroupObjList.splice(i,1);
                                    return true;
                                }
                            }return false;
                        };
                        this.addOption = function(optionGroupObj, optionText, value){
                            var opt = document.createElement('option');
                            if(optionText === '' || optionText === null){
                                if(value === '' || value === null){
                                    return false;
                                }
                                opt.innerHTML = value;
                                opt.value = value;
                            }else{
                                if(value === '' || value === null){
                                    opt.value = optionText;
                                }
                                opt.innerHTML = optionText;
                                opt.value = value;
                            }
                            if(optionGroupObj === null){
                                this.obj.appendChild(opt);
                            }else{
                                optionGroupObj.appendChild(opt);
                            }
                            return opt;
                        };
                        this.removeOption = function(optionText){
                            var opt;
                            for(var i=0;i<this.obj.options.length;i++){
                                opt = this.obj.options[i];
                                if(opt.innerHTML === optionText){
                                    this.obj.removeChild(opt);
                                    return true;
                                }
                            }return false;
                        };
                    },
                    searchBar: function(){
                        this.id = null;
                        this.obj = null;
                        this.placeholderText = 'Search text';
                        this.height = 15;           //pixels
                        this.possibleSourcesList = [];
                        this.search = function(){
                            //search the input
                        }
                    },
                    table: function(){
                        this.id = null;
                        this.obj = null;    //table object
                        this.parentObj = null;
                        this.height = 150;   //in pixels
                        this.width = 300;
                        this.noOfColumns = 2;
                        this.noOfRows = 2;
                        this.rowObjs = [[]];    //in order list of columns in list of rows
                        this.addRow = function(){
                            
                        };
                        this.removeRow = function(){
                            
                        };
                        this.addColumnToRow = function(){
                            
                        };
                        this.removeColumnFromRow = function(){
                            
                        };
                        this.addColumnToTable = function(){
                            
                        };
                        this.removeColumnFromTable = function(){
                            
                        };
                    },
                    tabGroup: function(){
                        //contains multiple tabs
                        this.id = null;
                        this.obj = null;
                        this.parentObj = null;
                        this.headWinObj = null;
                        this.buttonsWin = null;
                        this.dropDownIconObj = null;
                        this.dropDownDivObj = null;
                        this.contentWinObj = null;
                        this.tabList = [];
                        this.activeTab = null;
                        this.headHeight = 16;
                        this.tabWidth = 150;
                        var clicked=false;
                        
                        function toggle_tab_display(tbg){
                            var tbl = tbg.tabList;
                            var max_w = parseInt(window.getComputedStyle(tbg.headWinObj).width.split('px')[0], 10)-60;
                            var tw = tbg.activeTab.tabWidth;
                            var cnvt = parseInt(max_w/tw, 10);
                            var s=0, l=cnvt;
                            if(tbg.tabList.length<cnvt){
                                return;
                            }
                            for(var i=0;i<tbg.tabList.length;i++){
                                if(tbg.tabList[i].name === tbg.activeTab.name){
                                    if(i+1<=cnvt){
                                        l=cnvt;
                                    }else{
                                        s=i+1-cnvt;
                                        l=i+1;
                                    }
                                    break;
                                }
                            }
                            for(i=0;i<s;i++){
                                tbg.tabList[i].headObj.style.display = 'none';
                            }
                            for(i=s;i<l;i++){
                                tbg.tabList[i].headObj.style.display = 'block';
                            }
                            if(tbg.tabList.length>l){
                                for(var i=l;i<tbg.tabList.length;i++){
                                    tbg.tabList[i].headObj.style.display = 'none';
                                }
                            }
                        }
                        
                        function resizer(){
                            var tbgList = u$.App.TabGroups;
                            var tbg, w;
                            /*
                             * __ get the tab number of active number
                             * __ check if the tab can be contained in available space
                             *  __ if not, then set display of left most tab to none and repeat till current tab can be contained
                             *  __ if yes, then set display of remaining tabs, which cannot be contained to none
                             * 
                             */
                            for(var i=0;i<tbgList.length;i++){
                                tbg = tbgList[i];
                                var width = parseInt(window.getComputedStyle(tbg.headWinObj).width.split('px')[0], 10)-60;
                                if(tbg.tabList[0].tabWidth * tbg.tabList.length < width){    //to increase width if space is available
                                    w = parseInt(width/tbg.tabList.length, 10);
                                    if(w>150){return toggle_tab_display(tbg);}
                                    for(var i=0; i<tbg.tabList.length;i++){
                                        tbg.tabList[i].setWidth(w);
                                    }
                                    toggle_tab_display(tbg);
                                }else{
                                    var w = parseInt(width/tbg.tabList.length, 10);
                                    if(w<80){return toggle_tab_display(tbg);}   //to hide tabs when minimum limit is reached
                                    for(var i=0; i<tbg.tabList.length;i++){ //to decrease width if space is not available
                                        tbg.tabList[i].setWidth(w);
                                    }
                                }
                            }
                        }
                        window.addEventListener('resize', resizer, false);
                        
                        this.resizeTabHead = function(e){
                            resizer();
                        }
                        
                        this.shiftLeft = function(tbg){
                            var tbl = tbg.tabList;
                            if(tbg.tabList[tbg.tabList.length-1].headObj.style.display !== 'none'){
                                return; //return is rightmost tab is visible
                            }
                            //else find first element from beginning which is visible, make it invisible
                            for(var i=0;i<tbg.tabList.length;i++){
                                if(tbg.tabList[i].headObj.style.display !== 'none'){
                                    tbg.tabList[i].headObj.style.display = 'none';
                                    break;
                                }
                            }
                            //find first element from last which is visible, make elment next to it visble
                            for(i=tbg.tabList.length-2;i>0;i--){
                                if(tbg.tabList[i].headObj.style.display !== 'none'){
                                    tbg.tabList[i+1].headObj.style.display = 'block';
                                    return;
                                }
                            }
                        }
                        
                        this.shiftRight = function(tbg){
                            var tbl = tbg.tabList;
                            if(tbg.tabList[0].headObj.style.display !== 'none'){
                                return; //return is leftmost tab is visible
                            }
                            //else find first element from beginning which is visible, make element previous to it visible
                            for(var i=1;i<tbg.tabList.length;i++){
                                if(tbg.tabList[i].headObj.style.display !== 'none'){
                                    tbg.tabList[i-1].headObj.style.display = 'block';
                                    break;
                                }
                            }
                            //find first element from last which is visible, make it invisble
                            for(i=tbg.tabList.length-1;i>0;i--){
                                if(tbg.tabList[i].headObj.style.display !== 'none'){
                                    tbg.tabList[i].headObj.style.display = 'none';
                                    return;
                                }
                            }
                        }
                        
                        this.dropDown = function(e, tbg){
                            var evt = e || window.event || event;
                            if(tbg.dropDownIconObj === evt.target){
                                clicked = true;
                            }else{
                                clicked = false;
                            }
                            if(clicked){
                                if(tbg.dropDownDivObj.style.display === "none"){
                                    tbg.dropDownDivObj.style.display = "table";
                                }else{
                                    tbg.dropDownDivObj.style.display = "none";
                                }
                            }else{
                                tbg.dropDownDivObj.style.display = "none";
                            }
                        }
                        
                        function addRow2TabList(tbg, tabHead){
                            var row = document.createElement('div');
                            row.style.display = "block";
                            row.appendChild(tabHead);
                            tbg.dropDownDivObj.appendChild(tabHead);
                        }
                        
                        this.addTab = function(tab){
                            //append to tabgroup head
                            this.headWinObj.appendChild(tab.headObj);
                            tab.parentTabGroup = this;
                            this.tabList[this.tabList.length] = tab;
                            this.contentWinObj.appendChild(tab.contentWindow.obj);
                            tab.headObj.onclick = function(){
                                tab.parentTabGroup.setTabActive(tab.parentTabGroup, tab);
                            };
                            tab.setWidth(this.tabWidth);
                            tab.headObj.onclick();
                            tab.ddListObj.onclick = tab.headObj.onclick;
                            var imgs = tab.ddListObj.getElementsByTagName('img');
                            for(var i=0; i<imgs.length;i++){
                                if(imgs[i].alt === 'x'){
                                    imgs[i].onclick = function(e){tab.parentTabGroup.closeTab(tab.name);};
                                }
                            }
                            addRow2TabList(this, tab.ddListObj);
                            this.obj.addEventListener('resize', resizer, false);
                            resizer();
                        };
                        this.closeTab = function(tabName){
                            //remove its object from head
                            for(var i=0;i<this.tabList.length;i++){
                                if(this.tabList[i].name === tabName){
                                    var tab = this.tabList[i];
                                    this.headWinObj.removeChild(tab.headObj);
                                    this.dropDownDivObj.removeChild(tab.ddListObj);
                                    this.contentWinObj.obj.removeChild(tab.contentWindow.obj);
                                    this.tabList.splice(i,1);
                                    return;
                                }
                            }
                            //remove its object from contentwin
                        };
                        this.setTabActive = function(tbg, tab){
                            //display corresponding content window
                            for(var i=0;i<tbg.tabList.length;i++){
                                if(tbg.tabList[i].name === tab.name){
                                    tab.contentWindow.obj.style.display = 'block';
                                    tab.contentWindow.obj.contentEditable = true;
                                    tab.headObj.style.color = 'white';
                                    tab.headObj.style.backgroundColor = "#999999";
                                    this.activeTab = tab;
                                }else{
                                    tbg.tabList[i].contentWindow.obj.style.display = 'none';
                                    tbg.tabList[i].headObj.style.color = 'black';
                                    tbg.tabList[i].headObj.style.backgroundColor = '#eeeeee';
                                }
                            }
                        };
                    },
                    tab: function(){
                        //contains tabWindow
                        this.id = null;
                        this.obj = null;
                        this.headObj = null;
                        this.tbNameDivObj = null;
                        this.ddListObj = null;
                        this.parentObj = null;
                        this.tabHeight = 15;
                        this.tabWidth = 150;
                        this.backgroundImageUrl = 'img/tabBack.png';
                        this.iconType = 'png';      //png or svg or null
                        this.iconSrc = null;
                        this.name = null;
                        this.contentWindow = null;
                        this.parentTabGroup = null;
                        
                        this.addContent = function(window){
                            this.contentWindow = window;
                            this.contentWindow.obj.style.display = 'none';
                        };
                        this.setWidth = function(w){
                            this.tabWidth = w;
                            this.headObj.style.width = w+'px';
                            this.tbNameDivObj.style.width = (this.tabWidth-((this.tabHeight*2)+4))+'px';
                        }
                    },
                    statusCycle: function(){
                        //animated circle to show loading status
                    },
                    statusBar: function(){
                        //bar to show status
                    },
                    itemSeparator: function(){
                        //a simple item to create separations
                    },
                    itemTree: function(parentWin){
                        this.id = null;
                        this.obj = document.createElement('div');   //container tree object
                        this.containerObj = document.createElement('div');
                        this.parentObj = parentWin.obj;
                        this.path = '';
                        this.childNodes = [];   //child nodes
                        this.level = -1;        //contains nothing
                        
                        parentWin.obj.appendChild(this.obj);
                        this.obj.appendChild(this.containerObj);
                        this.containerObj.className = "nodeContents";
                        this.obj.style="position:relative;font-size:11px;";
                        
                        this.addNode = function(fileType, name, isLastNode){
                            var n = new u$.System.Library.Gui.Objects.itemTreeNode();
                            n.type = fileType;
                            n.name = name;
                            if(n.type !== 'd'){
                                var tmp = name.split('.');
                                if(tmp.length === 1){
                                    n.extension = 'all';
                                }else{
                                    n.extension = tmp[tmp.length-1];
                                }
                            }else{
                                n.extension = 'folder';
                            }
                            n.icnSrc = 'img/'+n.extension+'.png';
                            //create data node
                            var contDiv = document.createElement('div');
                            this.containerObj.appendChild(contDiv);
                            n.obj = contDiv;
                            n.parentObj = this.obj;
                            
                            if(fileType === 'd'){   //if folder, then two divs are required
                                contDiv.className = 'fdnode';
                                var nodeDiv = document.createElement('div');
                                nodeDiv.className = 'fxnode';
                                contDiv.appendChild(nodeDiv);
                                contDiv = nodeDiv;
                                //create container obj
                                nodeDiv = document.createElement('div');
                                nodeDiv.className = 'nodeContents';
                                n.containerObj = nodeDiv;
                                n.obj.appendChild(nodeDiv);
                            }else{  //if file, then only one div is enough
                                contDiv.className = 'fdnode fxnode';
                            }
                            
                            var tmp;
                            tmp = document.createElement('img');
                            tmp.style = 'height:15px;width:15px;';
                            tmp.alt = 'n';
                            n.prefixImageSet = {level:1, srcs:[]};
                            if(isLastNode){
                                if(fileType === 'd'){
                                    tmp.src = "img/last_openNode.png";
                                }else{
                                    tmp.src = 'img/last_file.png';
                                }
                                n.prefixImageSet.srcs[n.prefixImageSet.level-1] = "img/none.png";
                            }else{
                                if(fileType === 'd'){
                                    tmp.src = "img/openNode.png";
                                }else{
                                    tmp.src = 'img/file.png';
                                }
                                n.prefixImageSet.srcs[n.prefixImageSet.level-1] = "img/thread.png";
                            }
                            n.nodeIconObj = tmp;
                            tmp.onclick = n.nodeClick;
                            tmp.data = n;
                            contDiv.appendChild(tmp);
                            n.isLastNode = isLastNode;
                            //file/folder icon
                            tmp = document.createElement('img');
                            tmp.style = 'height:15px;width:15px;';
                            tmp.alt = 'n';
                            tmp.src = n.icnSrc;
                            tmp.data = n;
                            tmp.onclick = n.itemClick;
                            if(fileType === 'd'){
                                tmp.ondblclick = n.nodeClick;
                            }
                            contDiv.appendChild(tmp);
                            //add text
                            tmp = document.createElement('span');
                            tmp.style='position:absolute;top:0%;transform:translateY(2px);padding-left:3px;background-color:transparent';
                            tmp.innerHTML = name;
                            tmp.onclick = n.itemClick;
                            if(fileType === 'd'){
                                tmp.ondblclick = n.nodeClick;
                            }
                            n.textObj = tmp;
                            tmp.data = n;
                            contDiv.appendChild(tmp);
                            
                            this.childNodes[this.childNodes.length] = n;
                            n.root = this;
                            return n;
                        }
                    },
                    itemTreeNode: function(){
                        this.root = null;
                        this.obj = null;            //div object
                        this.dataObj = null;        //div containing current info
                        this.containerObj = null;   //div containing child objects...is created if type is folder
                        this.parentNode = null;     //container div for this node
                        //meta
                        this.id = null;
                        this.type = 'f';        //one of f/d
                        this.prefixImageSet = null;//{level:0,srcs:[]} images to be prefixed before actual data in dataObj
                        this.name = null;       //name of the entry
                        this.extension = '';    //one of txt/sql/py/html/php
                        this.nodeIconObj = null;
                        this.textObj = null;
                        this.icnSrc = '';       //src for icon based on extension
                        this.isLastNode = false;    //icon set for last nodes to be used
                        this.childNodes = [];   //child nodes
                        
                        function onNodeClick(e){
                            var evt = e || window.event || event;
                            evt.preventDefault();
                            var node = evt.target.data;
                            var state;
                            //toggle visibility
                            if(node.containerObj.style.display !== 'none'){
                                node.containerObj.style.display = "none";
                                state = 'closed';
                            }else{
                                node.containerObj.style.display = "block";
                                state = 'open';
                            }
                            //toggle icons
                            if(node.isLastNode){
                                if(node.type === 'd'){
                                    node.nodeIconObj.src = "img/last_"+state+"Node.png";
                                }else{
                                    node.nodeIconObj.src = 'img/last_file.png';
                                }
                            }else{
                                if(node.type === 'd'){
                                    node.nodeIconObj.src = "img/"+state+"Node.png";
                                }else{
                                    node.nodeIconObj.src = 'img/file.png';
                                }
                            }
                        }
                        this.nodeClick = onNodeClick;
                        
                        function resetBackground(node){ //returns true if non-transparent testObj is found, else false
                            if(node.textObj.style.backgroundColor !== 'transparent'){
                                node.textObj.style.backgroundColor = 'transparent';
                                return true;
                            }
                            for(var i=0;i<node.childNodes.length;i++){
                                resetBackground(node.childNodes[i]);
                            }
                            return false;
                        }
                        
                        function onItemClick(e){
                            var evt = e || window.event || event;
                            var node = evt.target.data;
                            //clear all backgrounds
                            for(var i=0;i<node.root.childNodes.length;i++){
                                if(resetBackground(node.root.childNodes[i])){
                                    break;
                                }
                            }
                            //set the color
                            node.textObj.style.backgroundColor = '#cccccc';
                        }
                        this.itemClick = onItemClick;
                        
                        this.addNode = function(fileType, name, isLastNode){
                            var n = new u$.System.Library.Gui.Objects.itemTreeNode();
                            n.type = fileType;
                            n.name = name;
                            if(n.type !== 'd'){
                                var tmp = name.split('.');
                                if(tmp.length === 1){
                                    n.extension = 'all';
                                }else{
                                    n.extension = tmp[tmp.length-1];
                                }
                            }else{
                                n.extension = 'folder';
                            }
                            n.icnSrc = 'img/'+n.extension+'.png';
                            //create data node
                            var contDiv = document.createElement('div');
                            this.containerObj.appendChild(contDiv);
                            n.obj = contDiv;
                            n.parentObj = this.obj;
                            
                            if(fileType === 'd'){   //if folder, then two divs are required
                                contDiv.className = 'fdnode';
                                var nodeDiv = document.createElement('div');
                                nodeDiv.className = 'fxnode';
                                contDiv.appendChild(nodeDiv);
                                contDiv = nodeDiv;
                                //create container obj
                                nodeDiv = document.createElement('div');
                                nodeDiv.className = 'nodeContents';
                                n.containerObj = nodeDiv;
                                n.obj.appendChild(nodeDiv);
                            }else{  //if file, then only one div is enough
                                contDiv.className = 'fdnode fxnode';
                            }
                            
                            var tmp;
                            for(var i=0;i<this.prefixImageSet.level;i++){
                                tmp = document.createElement('img');
                                tmp.style = 'height:15px;width:15px;';
                                tmp.alt = 'n';
                                tmp.src = this.prefixImageSet.srcs[i];
                                contDiv.appendChild(tmp);
                            }
                            tmp = document.createElement('img');
                            tmp.style = 'height:15px;width:15px;';
                            tmp.alt = 'n';
                            n.prefixImageSet = {level:this.prefixImageSet.level+1, srcs:this.prefixImageSet.srcs};
                            if(isLastNode){
                                if(fileType === 'd'){
                                    tmp.src = "img/last_openNode.png";
                                }else{
                                    tmp.src = 'img/last_file.png';
                                }
                                n.prefixImageSet.srcs[n.prefixImageSet.level-1] = "img/none.png";
                            }else{
                                if(fileType === 'd'){
                                    tmp.src = "img/openNode.png";
                                }else{
                                    tmp.src = 'img/file.png';
                                }
                                n.prefixImageSet.srcs[n.prefixImageSet.level-1] = "img/thread.png";
                            }
                            n.nodeIconObj = tmp;
                            tmp.onclick = onNodeClick;
                            tmp.data = n;
                            contDiv.appendChild(tmp);
                            n.isLastNode = isLastNode;
                            //file/folder icon
                            tmp = document.createElement('img');
                            tmp.style = 'height:15px;width:15px;';
                            tmp.alt = 'n';
                            tmp.src = n.icnSrc;
                            tmp.data = n;
                            tmp.onclick = onItemClick;
                            if(fileType === 'd'){
                                tmp.ondblclick = onNodeClick;
                            }
                            contDiv.appendChild(tmp);
                            //add text
                            tmp = document.createElement('span');
                            tmp.style='position:absolute;top:0%;transform:translateY(2px);padding-left:3px;background-color:transparent';
                            tmp.innerHTML = name;
                            tmp.onclick = onItemClick;
                            if(fileType === 'd'){
                                tmp.ondblclick = onNodeClick;
                            }
                            n.textObj = tmp;
                            tmp.data = n;
                            contDiv.appendChild(tmp);
                            
                            this.childNodes[this.childNodes.length] = n;
                            n.root = this.root;
                            return n;
                        }

                        function onExpanded(){

                        }
                        function onCollapsed(){

                        }
                    },
                    editorToolBar: function(){
                        //this is attached to every editor window
                    },
                    __editor: function(){
                        //core editor object, that is parent object for word and code editors
                    },
                    wordEditor: function(){
                        //word editor
                    },
                    codeEditor: function(){
                        //code editor with different options
                    },
                    scrollBar: function(){
                        //custom scroll bar
                    }
                },
                closeAllContextWindows: function(){
                    var i, menu = u$.System.Library.Gui.__data.menuItemList;
                    for(i=0;i<menu.length;i++){
                        if(menu[i].contextMenu !== null){
                            menu[i].contextMenu.setDisplay(false);
                        }
                    }
                    u$.System.Library.Gui.__data.itemClicked = false;
                },
                createWindow: function(parentWin, attributes){
                    var div = document.createElement('div');
                    for(var property in attributes){
                        if (attributes.hasOwnProperty(property)) {
                            div[property]=attributes[property];
                        }
                    }
                    div.className += ' uc_window';
                    if(div === null || div == 'undefined'){
                        return false;
                    }
                    if(parentWin !== null){
                        parentWin.obj.appendChild(div);
                    }
                    var ln = u$.App.Windows.length;
                    var win = new u$.Classes.Window();
                    win.obj = div;
                    win.parentObj = parentWin.obj;
                    win.id = div.id;
                    win.css = div.style;
                    u$.App.Windows[ln] = win;
                    return win;
                },
                createElement: function(element, parentWin, attributes){
                    var parent = parentWin.obj;
                    var elm = document.createElement(element);
                    for(var property in attributes){
                        if (attributes.hasOwnProperty(property)) {
                            elm[property]=attributes[property];
                        }
                    }
                    if(elm === null || elm == 'undefined'){
                        return false;
                    }
                    var obj = new u$.Classes.Object();
                    obj.obj = elm;
                    obj.parentObj = parent;
                    parent.appendChild(elm);
                    
                    u$.App.Objects[u$.App.Objects.length] = obj;
                    return obj;
                },
                createVerticalDragBar: function(parentWin, leftWinList, rightWinList, dragBarId, attributes){
                    var parentObj = parentWin.obj;
                    //create a div which could be used for horizontal resizing
                    if(parentObj !== null){
                        var dragBar = u$.System.Library.Gui.createElement('div', parentWin, attributes);
                        dragBar.obj.id = dragBarId;
                        dragBar.id = dragBarId;
                        for(var property in attributes){
                            if(attributes.hasOwnProperty(property)){
                                dragBar[property] = attributes[property];
                            }
                        }
                        dragBar.obj.addEventListener('mousedown', function(e){
                            u$.System.Library.Action.__horizontalDragStart(e, dragBar, leftWinList, rightWinList);
                        }, false);
                        dragBar.obj.className += ' uc_vDragBar';
                        parentObj.appendChild(dragBar.obj);
                        return dragBar;
                    }return null;
                },
                createHorizontalDragBar: function(parentWin, topWinList, bottomWinList, dragBarId, attributes){
                    var parentObj = parentWin.obj;
                    //create a div which could be used for vertical resizing
                    if(parentObj !== null){
                        var dragBar = u$.System.Library.Gui.createElement('div', parentWin, attributes);
                        dragBar.obj.id = dragBarId;
                        dragBar.id = dragBarId;
                        for(var property in attributes){
                            if(attributes.hasOwnProperty(property)){
                                dragBar.obj[property] = attributes[property];
                            }
                        }
                        dragBar.obj.addEventListener('mousedown', function(e){
                            u$.System.Library.Action.__verticalDragStart(e, dragBar, topWinList, bottomWinList);
                        }, false);
                        dragBar.obj.className += ' uc_hDragBar';
                        parentObj.appendChild(dragBar.obj);
                        return dragBar;
                    }return null;
                },
                addMenuItemSpacer: function(parentBar){
                    var obj = document.createElement('span');
                    obj.innerHTML = '&nbsp;';
                    parentBar.obj.appendChild(obj);
                },
                createMenuBarItem: function(parentBar, text, css){
                    var menuItem = document.createElement('button');
                    menuItem.innerHTML = text;
                    if(css != null){
                        menuItem.style = css;
                    }
                    
                    var mb_item = new u$.System.Library.Gui.Objects.menuItem();
                    menuItem.style.position = 'relative';
                    menuItem.style.border = '1px solid #cccccc';
                    menuItem.style.backgroundColor = mb_item.backgroundColor;
                    menuItem.style.outlineWidth = 0;
                    menuItem.className += ' uc_menuBarItem';
                    parentBar.obj.appendChild(menuItem);
                    mb_item.obj = menuItem;
                    mb_item.text = text;
                    menuItem.addEventListener('click', function(e){mb_item.onclick(e);}, false);
                    u$.System.Library.Gui.__data.menuItemList[u$.System.Library.Gui.__data.menuItemList.length] = mb_item;
                    return mb_item;
                },
                addContextMenuToItem: function(boundMenuItem){
                    var cmtbl = document.createElement('table');
                    var contextMenu = new u$.System.Library.Gui.Objects.menuContextWindow();
                    var cst = window.getComputedStyle(boundMenuItem.obj);
                    var left = boundMenuItem.obj.getBoundingClientRect().left;
                    var bottom = parseInt(cst.height.split('px')[0], 10)+boundMenuItem.obj.getBoundingClientRect().top;
                    cmtbl.style='position:absolute;top:'+bottom.toString()+'px;height:auto;left:'+left.toString()+'px;width:'+
                                contextMenu.width.toString()+"px;border:1px solid #999999;margin:0;background-color:#eeeeee;display:none";
                    cmtbl.style.borderCollapse = 'collapse';
                    u$.App.RootWindow.obj.appendChild(cmtbl);
                    contextMenu.obj = cmtbl;
                    contextMenu.boundItemObj = boundMenuItem.obj;
                    contextMenu.boundItemObj.addEventListener('mouseover', function(e){
                        u$.System.Library.Action.__menuItemHover(e, contextMenu);
                    }, false);
                    boundMenuItem.contextMenu = contextMenu;
                    return contextMenu;
                },
                addContextMenuToOption: function(boundOption){
                    if(boundOption.contextMenu !== null){
                        return false;
                    }
                    var pC = boundOption.parentContext;
                    var cmtbl = document.createElement('table');
                    var contextMenu = new u$.System.Library.Gui.Objects.menuContextWindow();
                    pC.setDisplay(true);
                    //get the dimentions
                    var cst = window.getComputedStyle(pC.obj);
                    var left = parseInt(cst.left.split('p')[0], 10)+parseInt(cst.width.split('p')[0], 10)-2;
                    var top = parseInt(pC.obj.style.top.split('p')[0], 10);
                    for(var i=0;i<pC.options.length;i++){
                        top += pC.options[i].getHeight();
                        if(pC.options[i] === boundOption || pC.options[i].obj === boundOption.obj){
                            break;
                        }
                    }
                    pC.setDisplay(false);
                    cmtbl.style='position:absolute;top:'+top.toString()+'px;height:auto;left:'+left.toString()+'px;width:'+
                                contextMenu.width.toString()+"px;border:1px solid #999999;margin:0;background-color:#eeeeee;display:none";
                    cmtbl.style.borderCollapse = 'collapse';
                    u$.App.RootWindow.obj.appendChild(cmtbl);
                    contextMenu.obj = cmtbl;
                    contextMenu.boundItemObj = boundOption.obj;
                    contextMenu.itemIsOption = true;
                    contextMenu.boundItemObj.addEventListener('mouseover', function(e){
                        u$.System.Library.Action.__menuOptionHover(e, contextMenu);
                    }, false);
                    boundOption.contextMenu = contextMenu;
                    boundOption.directorDivObj.innerHTML = '<i class="icon-right-dir"></i>';
                    boundOption.directorDivObj.style = 'text-align:right';
                    var ln = u$.System.Library.Gui.__data.contextWinOwnerOptionList.length;
                    u$.System.Library.Gui.__data.contextWinOwnerOptionList[ln] = boundOption;
                    return contextMenu;
                },
                createContextMenuOption: function(parentContext, text, iconName, onClickHandle){
                    //add item to context menu
                    var tmp, option = new u$.System.Library.Gui.Objects.menuItemOption();
                    option.parentObj = parentContext.obj;
                    var row = document.createElement('tr');
                    option.obj = row;
                    var h = option.getHeight();
                    //create icon
                    var td_temp = document.createElement('td');
                    var icn = document.createElement('div');
                    icn.style = 'height:100%;width:100%;margin:0;border:none;';
                    td_temp.style = 'width:15px;height:'+h+'px';
                    td_temp.appendChild(icn);
                    row.appendChild(td_temp);
                    option.iconObj = icn;
                    if(iconName !== null){
                        option.addSvgIcon(iconName);
                    }
                    //create text
                    td_temp = document.createElement('td');
                    var txt = document.createElement('span');
                    txt.innerHTML = text;
                    tmp = parseInt(parentContext.obj.style.width.split('p')[0], 10);
                    tmp = 'height:'+h+'px;width:'+(tmp-45).toString()+'px';
                    td_temp.style = tmp;
                    td_temp.appendChild(txt);
                    row.appendChild(td_temp);
                    option.textObj = txt;
                    //create director
                    td_temp = div = document.createElement('td');
                    var director = document.createElement('div');
                    td_temp.style = 'height:'+h+'px;width:30px;';
                    director.style = 'height:100%;width:100%;margin:0;border:none';
                    td_temp.appendChild(director);
                    row.appendChild(td_temp);
                    option.directorDivObj = director;
                    //set rest of things
                    row.addEventListener('click', onClickHandle, false);
                    option.onclick = onClickHandle;
                    row.className += 'uc_menuItemOption';
                    option.parentObj.appendChild(row);
                    row.addEventListener('mouseover', function(e){
                        u$.System.Library.Action.__menuOptionHover(e, null);
                    }, false);
                    parentContext.options[parentContext.options.length] = option;
                    option.parentContext = parentContext;
                    return option;
                },
                addOptionSeparator: function(context){
                    context.options[context.options.length-1].obj.style.borderBottom = '1px solid #999999';
                },
                createSearchBox: function(parentObject, properties){
                    
                },
                createButton: function(parentWin, text, height, width, clickHandle){
                    var btn = new u$.System.Library.Gui.Objects.button();
                    var elm = document.createElement('div');
                    elm.innerHTML = text;
                    elm.style.color = btn.color;
                    elm.className = 'uc_button';
                    elm.style.fontSize = '12px';
                    elm.onclick = clickHandle;
                    btn.obj = elm;
                    btn.parentObj = parentWin.obj;
                    btn.text = text;
                    btn.setHeightWidth(height, width);
                    parentWin.obj.appendChild(elm);
                    return btn;
                },
                createToolIconButton: function(parentWin, src, clickHandle){
                    var icn = new u$.System.Library.Gui.Objects.button();
                    var cd = document.createElement('div');
                    cd.style.height = '100%';
                    cd.style.width = icn.iconSide+'px';
                    cd.style.overflow = 'hidden';
                    cd.className = 'uc_icon';
                    var img = document.createElement('img');
                    img.alt = src;
                    img.src = src;
                    img.style = 'margin:4px 2px 2px 2px;display:inline';
                    img.style.width = (icn.iconSide-2)+'px';
                    icn.iconType = 'png';
                    icn.type = 'icon';
                    icn.text = null;
                    icn.obj = img;
                    icn.parentObj = parentWin.obj;
                    cd.appendChild(img);
                    try{
                        parentWin.contDivObj.appendChild(cd);
                    }catch(e){
                        parentWin.obj.appendChild(cd);
                    }
                    img.onclick = clickHandle;
                    return icn;
                },
                createIconButton: function(parentWin, src, alt, clickHandle){
                    var icn = new u$.System.Library.Gui.Objects.button();
                    var img = document.createElement('img');
                    img.alt = alt;
                    img.src = src;
                    img.className = 'uc_icon2';
                    img.style = 'margin:1px 1px 1px 1px;display:inline';
                    img.style.width = (icn.iconSide-2)+'px';
                    icn.iconType = 'png';
                    icn.type = 'icon';
                    icn.text = null;
                    icn.obj = img;
                    icn.parentObj = parentWin.obj;
                    try{
                        parentWin.contDivObj.appendChild(img);
                    }catch(e){
                        parentWin.obj.appendChild(img);
                    }
                    img.onclick = clickHandle;
                    return icn;
                },
                createIconComboButton: function(parentWin, src, clickHandle){
                    
                },
                createIconComboContext: function(comboButton){
                    
                },
                createComboInput: function(parentWin){
                    
                },
                createDropDown: function(parentWin){
                    var ddn = new u$.System.Library.Gui.Objects.dropDown();
                    var slt = document.createElement('select');
                    slt.style.height = ddn.height+'px';
                    slt.style.width = ddn.width+'px';
                    slt.style.fontSize = ddn.fontSize+'px';
                    slt.style.padding = 0;
                    ddn.obj = slt;
                    ddn.parentObj = parentWin.obj;
                    ddn.dropDownType = 'select';
                    parentWin.obj.appendChild(slt);
                    return ddn;
                },
                createTabGroup: function(parentWin){
                    var tbg = new u$.System.Library.Gui.Objects.tabGroup();
                    var tbgd = document.createElement('div');
                    tbgd.style = "position:absolute;top:0px;right:1px;bottom:0px;left:1px;border:1px solid #999999;";
                    tbg.obj = tbgd;
                    var head = document.createElement('div');
                    head.style = "position:absolute;top:0px;left:0px;right:50px;border-bottom:1px solid #999999;background-color:#eeeeee;";
                    head.style.height = tbg.headHeight+'px';
                    var bwin = u$.System.Library.Gui.createWindow(tbg, {style:"position:absolute;top:0px;width:50px;right:0px;height:16px;\n\
                            border-bottom:1px solid #999999;background-color:#eeeeee;text-align:right"});
                    var sh_left = u$.System.Library.Gui.createIconButton(bwin, 'img/left.png', 'l', function(e){tbg.shiftRight(tbg);});
                    var sh_right = u$.System.Library.Gui.createIconButton(bwin, 'img/right.png', 'r', function(e){tbg.shiftLeft(tbg);});
                    var sh_tabs = u$.System.Library.Gui.createIconButton(bwin, 'img/down.png', 'd', null);
                    
                    sh_left.setHeightWidth(10,10);
                    sh_left.obj.style.fontSize = '8px';
                    sh_left.obj.alt = 'l';
                    sh_right.setHeightWidth(10,10);
                    sh_right.obj.style.fontSize = '8px';
                    sh_right.obj.alt = 'r';
                    sh_tabs.setHeightWidth(10,10);
                    sh_tabs.obj.style.fontSize = '8px';
                    sh_tabs.obj.alt = 'd';
                    
                    var body = document.createElement('div');
                    body.style = "position:absolute;top:17px;left:0px;right:0px;bottom:0px;";
                    tbgd.appendChild(head);
                    tbgd.appendChild(bwin.obj);
                    tbgd.appendChild(body);
                    parentWin.obj.appendChild(tbgd);
                    tbg.headWinObj = head;
                    tbg.buttonsWin = bwin;
                    tbg.dropDownIconObj = sh_tabs.obj;
                    tbg.contentWinObj = body;
                    tbg.parentObj = parentWin.obj;
                    u$.App.TabGroups[u$.App.TabGroups.length] = tbg;
                    
                    //add drop down menu to down button
                    var tdiv = document.createElement('div');
                    var dim = sh_tabs.obj.getBoundingClientRect();
                    tdiv.style = 'font-size:10px;border:1px solid black;z-index:100;display:none;';
                    tdiv.style.transform = 'translateY(-3px) translateX(-'+50+'px)';
                    bwin.obj.appendChild(tdiv);
                    window.addEventListener('mouseup', function(e){tbg.dropDown(e, tbg);}, false);
                    tbg.dropDownDivObj = tdiv;
                    return tbg;
                },
                createTab: function(tabName, icon_src){
                    if(tabName===null || tabName === ''){
                        return false;
                    }
                    var tab = new u$.System.Library.Gui.Objects.tab();
                    //div for head
                    var head = document.createElement('div');
                    head.style = "position:relative;top:1px;overflow:hidden;background-size:cover;float:left";
                    head.style.backgroundImage = "url("+tab.backgroundImageUrl+")";
                    head.style.height = tab.tabHeight+'px';
                    head.style.width = tab.tabWidth+'px';
                    //add icon
                    var icn = document.createElement('img');
                    icn.alt = 'i';
                    icn.src = icon_src;
                    icn.style = "padding:1px 0px 0px 1px;float:left;";
                    icn.style.height = tab.tabHeight-2 +'px';
                    //add tab name
                    var tbname = document.createElement('div');
                    tbname.style = "position:absolute;display:inline-block;padding:2px 0px 0px 2px;font-size:10px;cursor:default;overflow:hidden";
                    tbname.style.left = (tab.tabHeight+2)+'px';
                    tbname.style.top = "50%";
                    tbname.style.transform = "translateY(-"+(750/tab.tabHeight)+"%)";
                    tbname.style.height = (tab.tabHeight-3)+'px';
                    tbname.style.width = (tab.tabWidth-((tab.tabHeight*2)+4))+'px';
                    tbname.innerHTML = tabName;
                    tbname.align = "left";
                    tab.tbNameDivObj = tbname;
                    //add close button
                    var close = document.createElement('div');
                    close.style = "display:inline-block;position:absolute;right:0px;height:"+tab.tabHeight+"px;width:"+tab.tabHeight+"px";
                    var cb = document.createElement('img');
                    cb.alt = 'x';
                    cb.src = 'img/close.png';
                    cb.className = 'uc_close';
                    cb.style = "position:absolute;top:"+(tab.tabHeight/4)+"px;left:"+(tab.tabHeight/4)+"px";
                    cb.style.padding = "1px 0px 0px 1px";
                    cb.style.height = (tab.tabHeight/2)-1 +'px';
                    cb.style.width = (tab.tabHeight/2)-1 +'px';
                    cb.onclick = function(e){tab.parentTabGroup.closeTab(tabName);};
                    close.appendChild(cb);
                    //append to head
                    head.appendChild(icn);
                    head.appendChild(tbname);
                    head.appendChild(close);
                    //create ddlist object
                    var ddl = document.createElement('div');
                    ddl.style = "position:relative";
                    ddl.style.height = tab.tabHeight+'px';
                    ddl.style.width = '100px';
                    ddl.innerHTML = head.innerHTML;
                    ddl.className = 'uc_menuItemOption';
                    //add data to tab object
                    tab.headObj = head;
                    tab.ddListObj = ddl;
                    tab.iconSrc = icon_src;
                    tab.name = tabName;
                    return tab;
                },
                createItemTree: function(parentWin){
                    var node = new u$.System.Library.Gui.Objects.itemTree(parentWin);
                    return node;
                },
                createToolBar: function(parentWin){
                    var tlb = new u$.System.Library.Gui.Objects.toolBar(parentWin);
                    u$.System.Library.Gui.__data.toolBar = tlb;
                    return tlb;
                },
                createToolsGroup: function(parentToolBar){
                    /*
                     * __ create a div: [div: drag area, div:data container with fixed hieght, variable width]
                     */
                    var toolsGroup = new u$.System.Library.Gui.Objects.toolsGroup();
                    var tg_div = document.createElement('div');
                    tg_div.style.height = toolsGroup.height+'px';
                    tg_div.className = 'uc_toolsGroup';
                    var dg_div = document.createElement('div');
                    var cn_div = document.createElement('div');
                    dg_div.className = 'uc_toolsDragger';
                    cn_div.style = "height:24px;border:none;margin:2px 2px 2px 2px;float:left";
                    tg_div.appendChild(dg_div);
                    tg_div.appendChild(cn_div);
                    toolsGroup.draggerObj = dg_div;
                    toolsGroup.contDivObj = cn_div;
                    toolsGroup.obj = tg_div;
                    toolsGroup.parentToolBar = parentToolBar;
                    parentToolBar.addToolsGroup(toolsGroup);
                    return toolsGroup;
                }
            },
            Utility:{
                //utility api
                searchPropertyInObjList: function(list, prop, val){
                    for(var obj in list){
                        if(obj.hasOwnProperty(prop)){
                            if(obj[prop] === val){
                                return obj;
                            }
                        }
                    }return null;
                }
            }
        },
        setRootWindow: function(rootDivId){
            var rdiv = document.getElementById(rootDivId);
            if(!(rdiv === null || rdiv == 'undefined')){
                u$.App.RootWindow = rdiv;
            }
        },
        sysInit: function(){
            //init services
           u$.System.Services.__data.timerObj = setInterval(u$.System.Services.__exec(),10);
           //init root window
           var rwin = new u$.Classes.Window();
           rwin.obj = document.getElementsByTagName('body')[0];
           u$.App.RootWindow = rwin;
           // init style classes for all the possible objects
           var head = document.getElementsByTagName('head')[0];
           var data ='\n';
           for(var cls in u$.System.Library.Gui.Classes){
               if(u$.System.Library.Gui.Classes.hasOwnProperty(cls)){
                   data += u$.System.Library.Gui.Classes[cls];
               }
               data += '\n';
           }
           var style = document.createElement('style');
           style.innerHTML = data;
           head.appendChild(style);
           
           //console = document.createElement('div');
           //console.style = "position:absolute;top:30%;left:30%;height:40%;width:40%;border:1px solid black;z-index:33;";
           //document.body.appendChild(console);
           
           //init events for different objects
           document.body.addEventListener('mouseup', u$.System.Library.Action.__dragEnd, false);
           window.addEventListener('click', function(e){
               u$.System.Library.Gui.__data.closeAllContextWindows(e);
               u$.System.Library.Gui.__data.closeOptionAllContextWindows(e);
           }, false);    //close all context menues on click
       }
    }
};
microjs = u$;


