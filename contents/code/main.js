function log(msg) {
  print("SmartTile: " + msg);
}

function _GetScreenGeometry() {
  return workspace.clientArea(KWin.PlacementArea, workspace.activeScreen, workspace.Desktop)
}

function _GetClientGeometryOnScreen() {
  var clientGeometry = workspace.activeClient.geometry
  var screenGeometry = _GetScreenGeometry()
  clientGeometry.x -= screenGeometry.x
  clientGeometry.y -= screenGeometry.y
  return clientGeometry
}

function _IsVerticallyMaximized() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.height === screenGeometry.height) {
    return true
  }
  return false
}

function _IsHorizontallyMaximized() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.width === screenGeometry.width) {
    return true
  }
  return false
}

function _IsMaximized() {
  return _IsHorizontallyMaximized() && _IsVerticallyMaximized()
}

function _IsTiledToTop() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.height === (screenGeometry.height / 2) && clientGeometry.y === 0) {
    return true
  }
  return false
}

function _IsTiledTop() {
  return _IsTiledToTop() && _IsHorizontallyMaximized()
}

function _IsTiledToBottom() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.height === (screenGeometry.height / 2) && clientGeometry.y === (screenGeometry.height / 2)) {
    return true
  }
  return false
}

function _IsTiledBottom() {
  return _IsTiledToBottom() && _IsHorizontallyMaximized()
}

function _IsTiledToLeft() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.x === 0) {
    return true
  }
  return false
}

function _IsTiledLeft() {
  return _IsTiledToLeft() && _IsVerticallyMaximized()
}

function _IsTiledToRight() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.x === (screenGeometry.width / 2)) {
    return true
  }
  return false
}

function _IsTiledRight() {
  return _IsTiledToRight() && _IsVerticallyMaximized()
}

function _IsTiledToQuadrant() {
  var screenGeometry = _GetScreenGeometry()
  var clientGeometry = _GetClientGeometryOnScreen()
  if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.height === (screenGeometry.height / 2)) {
    return true
  }
  return false
}

function _IsTiledTopLeft() {
  return _IsTiledToTop() && _IsTiledToLeft()
}

function _IsTiledTopRight() {
  return _IsTiledToTop() && _IsTiledToRight()
}

function _IsTiledBottomLeft() {
  return _IsTiledToBottom() && _IsTiledToLeft()
}

function _IsTiledBottomRight() {
  return _IsTiledToBottom() && _IsTiledToRight()
}

var QuickTileUp = function () {
  // L > TL
  if (_IsTiledLeft()) {
    workspace.slotWindowQuickTileTopLeft()
    // R > TR
  } else if (_IsTiledRight()) {
    workspace.slotWindowQuickTileTopRight()
    // B > T
  } else if (_IsTiledBottom()) {
    workspace.slotWindowMaximize()
    // BL > L
  } else if (_IsTiledBottomLeft()) {
    workspace.slotWindowQuickTileLeft()
    // BR > R
  } else if (_IsTiledBottomRight()) {
    workspace.slotWindowQuickTileRight()
    // M > Restore
  } else if (_IsMaximized()) {
    workspace.slotWindowMaximize()
  } else {
    workspace.slotWindowMaximize()
  }
}

var QuickTileDown = function () {
  // L > BL
  if (_IsTiledLeft()) {
    workspace.slotWindowQuickTileBottomLeft()
    // R > BR
  } else if (_IsTiledRight()) {
    workspace.slotWindowQuickTileBottomRight()
    // T > B
  } else if (_IsTiledTop()) {
    workspace.slotWindowMaximize()
    // TL > L
  } else if (_IsTiledTopLeft()) {
    workspace.slotWindowQuickTileLeft()
    // TR > R
  } else if (_IsTiledTopRight()) {
    workspace.slotWindowQuickTileRight()
    // M > B
  } else if (_IsMaximized()) {
    workspace.slotWindowQuickTileBottom()
  } else {
    workspace.slotWindowMinimize()
  }
}

var QuickTileLeft = function () {
  // T > TL
  if (_IsTiledTop()) {
    workspace.slotWindowQuickTileTopLeft()
    // B > BL
  } else if (_IsTiledBottom()) {
    workspace.slotWindowQuickTileBottomLeft()
    // TR > T
  } else if (_IsTiledTopRight()) {
    workspace.slotWindowQuickTileTop()
    // BR > B
  } else if (_IsTiledBottomRight()) {
    workspace.slotWindowQuickTileBottom()
    // M > L
  } else if (_IsMaximized()) {
    workspace.slotWindowQuickTileLeft()
    // R > L
  } else if (_IsTiledRight()) {
    workspace.slotWindowMaximize()
    // BL > L, TL > L
  } else {
    workspace.slotWindowQuickTileLeft()
  }
}

var QuickTileRight = function () {
  // T > TR
  if (_IsTiledTop()) {
    workspace.slotWindowQuickTileTopRight()
    // B > BR
  } else if (_IsTiledBottom()) {
    workspace.slotWindowQuickTileBottomRight()
    // TL > T
  } else if (_IsTiledTopLeft()) {
    workspace.slotWindowQuickTileTop()
    // BL > B
  } else if (_IsTiledBottomLeft()) {
    workspace.slotWindowQuickTileBottom()
    // M > R
  } else if (_IsMaximized()) {
    workspace.slotWindowQuickTileRight()
    // L > R
  } else if (_IsTiledLeft()) {
    workspace.slotWindowMaximize()
    // BR > R, TR > R
  } else {
    workspace.slotWindowQuickTileRight()
  }
}

var state = {
  enabled: true
};

function install() {
  var shortcutPrefix = "SmartTile "
  registerShortcut(shortcutPrefix + "Up", shortcutPrefix + "Up", "Meta+Up", QuickTileUp)
  registerShortcut(shortcutPrefix + "Down", shortcutPrefix + "Down", "Meta+Down", QuickTileDown)
  registerShortcut(shortcutPrefix + "Left", shortcutPrefix + "Left", "Meta+Left", QuickTileLeft)
  registerShortcut(shortcutPrefix + "Right", shortcutPrefix + "Right", "Meta+Right", QuickTileRight)
  log("Handler installed");
}

function uninstall() {
  log("Handler cleared");
}

registerUserActionsMenu(function (client) {
  return {
    text: "Smart Tile",
    items: [{
      text: "Enabled",
      checkable: true,
      checked: state.enabled,
      triggered: function () {
        state.enabled = !state.enabled;
        if (state.enabled) {
          install();
        } else {
          uninstall();
        }
      }
    }, ]
  };
});

install();
