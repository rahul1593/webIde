/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
    //add options to file: new, open, close, save, save as, save all, download, import project, export project, exit -----------------------------------
    var file_cm = u$.System.Library.Gui.addContextMenuToItem(file);
    var file_scm1_new = u$.System.Library.Gui.createContextMenuOption(file_cm, 'New File', null);
    var file_scm1_open = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Open File', null);
    var file_scm1_close = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Close File', null);
    u$.System.Library.Gui.addOptionSeparator(file_cm);
    var file_scm2_save = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Save', null);
    var file_scm2_saveas = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Save As', null);
    var file_scm2_saveall = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Save All', null);
    u$.System.Library.Gui.addOptionSeparator(file_cm);
    var file_scm3_dwnld = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Download', null);
    var file_scm3_imp = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Import Project', null);
    var file_scm3_exp = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Export Project', null);
    u$.System.Library.Gui.addOptionSeparator(file_cm);
    var file_scm4_exit = u$.System.Library.Gui.createContextMenuOption(file_cm, 'Exit', null);
    
    //add options to edit: undo, redo, cut, copy, paste, delete, find, replace -------------------------------------------------------------------------
    var edit_cm = u$.System.Library.Gui.addContextMenuToItem(edit);
    var edit_scm1_undo = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Undo', null);
    var edit_scm1_redo = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Redo', null);
    u$.System.Library.Gui.addOptionSeparator(edit_cm);
    var edit_scm2_cut = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Cut', null);
    var edit_scm2_copy = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Copy', null);
    var edit_scm2_paste = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Paste', null);
    var edit_scm2_delete = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Delete', null);
    u$.System.Library.Gui.addOptionSeparator(edit_cm);
    var edit_scm3_find = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Find', null);
    var edit_scm3_replace = u$.System.Library.Gui.createContextMenuOption(edit_cm, 'Replace', null);
    
    //add options to view: footer menu: show status, show info, toolbar menu: fileoperations, run config, edit -----------------------------------------
    var view_cm = u$.System.Library.Gui.addContextMenuToItem(view);
    view_cm.setWidth(150);
    var view_scm1_ssts = u$.System.Library.Gui.createContextMenuOption(view_cm, 'Show IDE Status', null);
    var view_scm1_sinf = u$.System.Library.Gui.createContextMenuOption(view_cm, 'Show Info', null);
    u$.System.Library.Gui.addOptionSeparator(view_cm);
    var view_scm2_run = u$.System.Library.Gui.createContextMenuOption(view_cm, 'Show Run Toolbar', null);
    var view_scm2_edit = u$.System.Library.Gui.createContextMenuOption(view_cm, 'Show Edit Toolbar', null);
    
    //add options to project: new project, open project, close project, options, run project, run configuration ----------------------------------------
    var proj_cm = u$.System.Library.Gui.addContextMenuToItem(project);
    //var proj_scm1 = u$.System.Library.Gui.addSubContextMenu(proj_cm);
    var proj_scm1_new = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'New Project', null);
    var proj_scm1_open = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'Open Project', null);
    var proj_scm1_close = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'Close Project', null);
    u$.System.Library.Gui.addOptionSeparator(proj_cm);
    var proj_scm2_run = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'Run', null);
    var proj_scm2_runc = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'Run Config', null);
    var proj_scm2_opt = u$.System.Library.Gui.createContextMenuOption(proj_cm, 'Options', null);
    
    //add options to window: object explorer, editor, output, console, details, layout menu: sql, python, web, doc, reset layout -----------------------
    var win_cm = u$.System.Library.Gui.addContextMenuToItem(win);
    win_cm.setWidth(150);
    var win_scm1_obex = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Object Explorer', null);
    var win_scm1_editor = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Editor', null);
    var win_scm1_output = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Output', null);
    var win_scm1_console = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Console', null);
    var win_scm1_details = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Details', null);
    u$.System.Library.Gui.addOptionSeparator(win_cm);
    var win_scm2_layout = u$.System.Library.Gui.createContextMenuOption(win_cm, 'Layout', null);
        //add context to layout option
    var win_scm2_lt_cm = u$.System.Library.Gui.addContextMenuToOption(win_scm2_layout);
    var win_scm2_lt_scm1_none = u$.System.Library.Gui.createContextMenuOption(win_scm2_lt_cm, 'None', null);
    
    //add options to tools: templates, options, external menu: ..if any --------------------------------------------------------------------------------
    var tools_cm = u$.System.Library.Gui.addContextMenuToItem(tools);
    var tools_scm1_tmpl = u$.System.Library.Gui.createContextMenuOption(tools_cm, 'Templates', null);
    var tools_scm1_prf = u$.System.Library.Gui.createContextMenuOption(tools_cm, 'preferences', null);
    var tools_scm1_ext = u$.System.Library.Gui.createContextMenuOption(tools_cm, 'External Tools', null);
    
    //add options to help: Help, Documents, Report Issues, About ---------------------------------------------------------------------------------------
    var help_cm = u$.System.Library.Gui.addContextMenuToItem(help);
    var help_scm1_help = u$.System.Library.Gui.createContextMenuOption(help_cm, 'Help Contents', null);
    var help_scm1_issues = u$.System.Library.Gui.createContextMenuOption(help_cm, 'Report Issues', null);
    u$.System.Library.Gui.addOptionSeparator(help_cm);
    var help_scm2_about = u$.System.Library.Gui.createContextMenuOption(help_cm, 'About IDE', null);
    
}

u$.System.sysInit();
init_ideWindows();
init_menuBar();
