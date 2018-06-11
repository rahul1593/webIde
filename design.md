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

__ Level 1 __
-- Window

__ Level 2 __
-- Tab Group
-- Context Window

__ Level 3 __
  -- Menu Bar
    > Menu Item
      > Item Option(type: button, menu item)
  -- Toolbar
    > Toolbar Item
  -- Footer
  -- Session Menu Bar(Special case of Menu Bar)

__ Level 4 __
-- Canvas Area
-- SVG Area

__ Level 5 __(Dual Type: HTML or SVG objects)
    -- Input Field
    -- Button
    -- Radio-Multiselect Button
    -- Drop down
    -- Directory Tree
    -- Context Menu(Special case of Menu Item)
    -- Progress Bar
    -- Search Bar
