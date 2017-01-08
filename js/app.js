/* 
 * Author: Rahul Bhartari.
 * 
 * 
 */

var objExp_style = 'position:absolute;left:0%;width:18.1%;top:0%;height:99.8%;border-top:1px solid black;border-bottom:1px solid black;border-left:1px solid black';
var queryWin_style = 'position:absolute;left:18.3%;width:63.3%;top:0%;height:55.1%;border-top:1px solid black';
var optWin_style = 'position:absolute;left:18.3%;width:63.3%;top:55.7%;height:44.2%;border-bottom:1px solid black';
var infoWin_style = 'position:absolute;left:81.8%;width:18.1%;top:0%;height:99.8%;border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black';
//some parentWindow objects
menuBarWin = null;
footerWin = null;
obexWin = null;
editorWin = null;
outputWin = null;
infoWin = null;


function init_ideWindows(){
    var rootWin = u$.App.RootWindow;
    //create main windows
    var mBar = u$.System.Library.Gui.createWindow(rootWin, {id:'menuBar', class:'ideFont'});
    var wk_area = u$.System.Library.Gui.createWindow(rootWin,{id:"workArea",class:"ideFont"});
    //get height of menubar and set top for workarea
    var delta = window.getComputedStyle(mBar.obj);
    delta = parseInt(delta.top.split('px')[0], 10) + parseInt(delta.height.split('px')[0], 10)+2;
    var wa_cst = window.getComputedStyle(wk_area.obj);
    wk_area.obj.style.top = delta.toString()+'px';
    wk_area.obj.style.height = (parseInt(wa_cst.height.split('px')[0], 10)+(delta-parseInt(wa_cst.top.split('px')[0], 10))).toString()+'px';
    //create rest of the windows
    var ftr = u$.System.Library.Gui.createWindow(rootWin, {id:"footer", class:'ideFont'});
    var obex = u$.System.Library.Gui.createWindow(wk_area, {id:'objectExplorer', class:'ideFont', style:objExp_style});
    obex.minWidth = 150;
    var qryWin = u$.System.Library.Gui.createWindow(wk_area, {id:'queryWindow', class:'ideFont', style:queryWin_style});
    qryWin.minHeight = 150;
    qryWin.minWidth = 300;
    var otpWin = u$.System.Library.Gui.createWindow(wk_area, {id:'outputWindow', class:'ideFont', style:optWin_style});
    otpWin.minHeight = 100;
    otpWin.minWidth = 300;
    var infWin = u$.System.Library.Gui.createWindow(wk_area, {id:'infoWindow', class:'ideFont', style:infoWin_style});
    infWin.minWidth = 100;

    var qrw_drgb = u$.System.Library.Gui.createHorizontalDragBar(wk_area, [qryWin], [otpWin], 'qrwn_dragBar',
                {style:'position:absolute;top:55.4%;left:18.2%;height:2px;width:63.5%;background-color:#cccccc'});
    var obx_drgb = u$.System.Library.Gui.createVerticalDragBar(wk_area, [obex], [qryWin, otpWin, qrw_drgb], 'obex_dragBar',
                {style:'position:absolute;top:0.4%;left:18.2%;height:99.4%;width:2px;background-color:#cccccc'});
    var inf_drgb = u$.System.Library.Gui.createVerticalDragBar(wk_area, [qryWin, otpWin, qrw_drgb], [infWin], 'infw_dragBar',
                {style:'position:absolute;top:0.4%;left:81.6%;height:99.4%;width:2px;background-color:#cccccc'});
    //init a few global variables
    menuBarWin = mBar;
    footerWin = ftr;
    obexWin = obex;
    editorWin = qryWin;
    outputWin = otpWin;
    infoWin = infWin;
    //resize action
    window.onresize = function(){
        //adjust workarea top
        var tp, wka_delta = window.getComputedStyle(mBar.obj);
        wka_delta = parseInt(wka_delta.top.split('px')[0], 10)+parseInt(wka_delta.height.split('px')[0])+2;
        tp = wka_delta;
        wk_area.obj.style.top = wka_delta.toString()+'px';
        //adjust workarea height
        wka_delta = window.getComputedStyle(ftr.obj);
        wka_delta = parseInt(wka_delta.top.split('px')[0], 10)-2;
        wk_area.obj.style.height = (wka_delta-tp).toString()+'px';
        
        obex.obj.style = objExp_style;
        qryWin.obj.style = queryWin_style;
        otpWin.obj.style = optWin_style;
        infWin.obj.style = infoWin_style;
        qrw_drgb.obj.style = 'position:absolute;top:55.4%;left:18.2%;height:2px;width:63.5%;background-color:#cccccc';
        obx_drgb.obj.style = 'position:absolute;top:0.4%;left:18.2%;height:99.4%;width:2px;background-color:#cccccc';
        inf_drgb.obj.style = 'position:absolute;top:0.4%;left:81.6%;height:99.4%;width:2px;background-color:#cccccc';
    };
    window.onresize();
}

function init_menuBar(){
    u$.System.Library.Gui.addMenuItemSpacer(menuBarWin);
    var file = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'File', null);
    var edit = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'Edit', null);
    var view = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'View', null);
    var project = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'Project', null);
    var win = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'Window', null);
    var tools = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'Tools', null);
    var help = u$.System.Library.Gui.createMenuBarItem(menuBarWin, 'Help', null);
    //add options to file: new, open, close, save, save as, save all, download, import project, export project, exit
    u$.System.Library.Gui.createMenuBarItemOption(file, 'New', null);
    //add options to edit: undo, redo, cut, copy, paste, delete, find, replace
    //add options to view: footer menu: show status, show info, toolbar menu: fileoperations, run config, edit
    //add options to project: new project, open project, close project, options, run configuration
    //add options to window: object explorer, editor, output, console, details, layout menu: sql, python, web, doc, reset layout
    //add options to tools: templates, options, external menu: ..if any
    //add options to help: Help, Documents, Report Issues, About
}

u$.System.sysInit();
init_ideWindows();
init_menuBar();
