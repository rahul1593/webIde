### Feautures
1. Services using timers and webworkers
2. Tasks using webworkers
3. Custom JSON Themes support
4. Plugins support for custome UI components
5. Load UI and callbacks from JSON definition
6. Supports HTML Canvas and SVG based UI objects 
7. Supports AJAX and websockets for server communication
8. Supports Logging for debugging

### UI Objects Heirarchy

Any object in Higher level can be placed in any object in Lower Level.
For example, any object from Level 4 can be placed within any object in level 2.

Any Object can have constituent objects (starting with '>') which can only be used within that object.

__Level 1__
* Window

__Level 2__
* Tab Group
* Context Window

__Level 3__
 * Menu Bar
    > Menu Item
      > Item Option(type: button, menu item)
  * Toolbar
    > Toolbar Item
  * Footer
  * Session Menu Bar(Special case of Menu Bar)

__Level 4__
* Canvas Area
* SVG Area

__Level 5__(Dual Type: HTML or SVG objects)
    * Input Field
    * Button
    * Radio-Multiselect Button
    * Drop down
    * Directory Tree
    * Context Menu(Special case of Menu Item)
    * Progress Bar
    * Search Bar
