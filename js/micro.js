/*
 * Author: Rahul Bhartari
 */
u$ = {
    App:{
       Name:null,
       Services:[],
       RootWindow:null,
       Windows:[],
       Objects:[],
       getWindowById: function(id){
           return u$.System.Library.Utility.searchPropertyInObjList(y$.App.Windows, 'id', id);
       },
       getObjectById: function(id){
           return u$.System.Library.Utility.searchPropertyInObjList(y$.App.Objects, 'id', id);
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
                    menuBarItem: '.uc_menuBarItem{font-size:10px;background-color:#cccccc;padding-left:2px;padding-right:2px;cursor:context-menu}\n\
                                    .uc_menuBarItem:hover,.uc_menuBarItem:active\n\
                                    {background-color:#eeeeee;border:1px solid #cccccc}',
                    menuItemOption: '.uc_menuItemOption{font-size:10px}\n\
                                    .uc_menuItemOption:hover,.uc_menuItemOption:active{background-color:#cccccc;cursor:context-menu}',
                    icon: '.uc_icon{border:1px solid white}\n.uc_icon:hover,.uc_icon:active{border:1px solid black}',
                    hDragBar:'uc_hDragBar{}\n.uc_hDragBar:hover,.uc_hDragBar:active{cursor:row-resize}',
                    vDragBar:'uc_vDragBar{}\n.uc_vDragBar:hover,.uc_vDragBar:active{cursor:col-resize}'
                },
                __data:{
                    itemClicked: false,
                    menuItemList: [],
                    contextWinOwnerOptionList: [],
                    getMenuItemByText: function(text){
                        return u$.System.Library.Utility.searchPropertyInObjList(u$.System.Library.Gui.__data.menuItemList, 'text', text);
                    },
                    closeAllContextWindows: function(e){
                        var f=0,i;
                        var menu = u$.System.Library.Gui.__data.menuItemList;
                        var evt = window.event || e || event;
                        var target = evt.target;
                        for(i=0;i<menu.length;i++){
                            if(menu[i].contextMenu !== null){
                                if(target !== menu[i].obj){
                                    if(!menu[i].contextMenu.obj.contains(target)){
                                        menu[i].contextMenu.setDisplay(false);
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
                            if(!opts[i].contextMenu.obj.contains(evt.target)){  //---------------------------------to be improved
                                opts[i].contextMenu.setDisplay(false);
                            }else{
                                var pCntx = opts[i].parentContext;
                                while(pCntx.itemIsOption){
                                    pCntx.setDisplay(true);
                                    pCntx = pCntx.boundItemObj.parentContext;
                                }pCntx.setDisplay(true);
                            }
                        }
                    }
                },
                Objects:{
                    icon: function(){
                        this.obj = null;
                        this.imageUrl = '';
                        this.sideLength = 15;   //length in pixels
                    },
                    menuItem: function(){
                        this.id = null;
                        this.obj = null;
                        this.text = null;
                        this.contextMenu = null;    //menuContextWindow object
                        this.onclick = function(){
                            if(this.contextMenu !== null){
                                this.contextMenu.setDisplay(!this.contextMenu.displayStatus);
                                u$.System.Library.Gui.__data.itemClicked = this.contextMenu.displayStatus;
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
                        }
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
                    menuItem.style.position = 'relative';
                    menuItem.style.border = '1px solid #cccccc';
                    menuItem.className += ' uc_menuBarItem';
                    parentBar.obj.appendChild(menuItem);
                    var mb_item = new u$.System.Library.Gui.Objects.menuItem();
                    mb_item.obj = menuItem;
                    mb_item.text = text;
                    menuItem.addEventListener('click', function(){mb_item.onclick();}, false);
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
                                contextMenu.width.toString()+"px;border:1px solid black;margin:0;background-color:#eeeeee;display:none";
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
                                contextMenu.width.toString()+"px;border:1px solid black;margin:0;background-color:#eeeeee;display:none";
                    cmtbl.style.borderCollapse = 'collapse';
                    u$.App.RootWindow.obj.appendChild(cmtbl);
                    contextMenu.obj = cmtbl;
                    contextMenu.boundItemObj = boundOption.obj;
                    contextMenu.itemIsOption = true;
                    contextMenu.boundItemObj.addEventListener('mouseover', function(e){
                        u$.System.Library.Action.__menuOptionHover(e, contextMenu);
                    }, false);
                    boundOption.contextMenu = contextMenu;
                    boundOption.directorDivObj.innerHTML = '>'; //----------------------------to be changed
                    boundOption.directorDivObj.style = 'text-align:right;font-size:7px';
                    var ln = u$.System.Library.Gui.__data.contextWinOwnerOptionList.length;
                    u$.System.Library.Gui.__data.contextWinOwnerOptionList[ln] = boundOption;
                    return contextMenu;
                },
                createContextMenuOption: function(parentContext, text, onClickHandle){
                    //add item to context menu
                    var tmp, option = new u$.System.Library.Gui.Objects.menuItemOption();
                    option.parentObj = parentContext.obj;
                    var row = document.createElement('tr');
                    option.obj = row;
                    var h = option.getHeight();
                    //create icon
                    var td_temp = document.createElement('td');
                    var icn = document.createElement('img');
                    icn.style = 'height:100%;width:100%;margin:0;border:none;visibility:hidden';
                    td_temp.style = 'width:15px;height:'+h+'px';
                    td_temp.appendChild(icn);
                    row.appendChild(td_temp);
                    option.iconObj = icn;
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
                addIconToMenuOption: function(){
                    
                },
                addOptionSeparator: function(context){
                    context.options[context.options.length-1].obj.style.borderBottom = '1px solid black';
                },
                createSearchBox: function(parentObject, properties){
                    
                },
                createTabGroup: function(parentWindow, tabGroupFeatures){
                    
                },
                createTab: function(parentTabGroup, tabFeatures){
                    
                },
                createItemTree: function(parentObject, treeFeatures){
                    
                },
                createTreeItem: function(parentTree, treeItemFeatures){
                    
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


