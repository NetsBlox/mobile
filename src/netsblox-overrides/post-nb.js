// overriding netsblox/snap features for mobile use
console.log('overriding netsblox for mobile use. post-nb');
// override helper
let branchFn = (originalFn, condition, newFn) => {
  let self = this;
  return function() {
    if (condition()) {
      return newFn.apply(self, arguments);
    } // else
    return originalFn.apply(self, arguments);
  };
};


// update geolocation to access native mobile sensors
NetsProcess.prototype.getLocation = function() {
  if (parent.mobile.platform === 'unknown') {
    // means we are running in a browser or an unsupported platfrom
    alert('unsupported platform, using mock location data');
    console.error('can\'t access device\'s location information');
    return {latitude: 36, longitude: -86};
  }

  let myself = this,
    errorName;

  if (this.location === undefined) {
    this.locationError = null;
    let posOptions = { timeout: 10000, enableHighAccuracy: false, maximumAge: 10000 };
    if (mobileHandle.diagnosticService.locationAvailable) {
      mobileHandle.geolocation.getCurrentPosition(posOptions)
        .then(location => {
          myself.location = location;
        })
        .catch(err => {
          myself.locationError = err;
          myself.location = null;
        });
    } else { // request for location access
      let canReqLocAuth = mobileHandle.diagnosticService.canRequestLocationAuthorization();
      if (canReqLocAuth) mobileHandle.diagnosticService.requestLocationAuthorization();
    }
  } else {
    var location = this.location;
    this.location = undefined;
    if (this.locationError || !location) {
      this.locationError = this.locationError || new Error('Could not determine location');
      // Error 'name' is not always provided for PositionErrors. Try to get
      // the name of the Error. Fall back on 'Error'
      errorName = this.locationError.name || (this.locationError.constructor &&
        this.locationError.constructor.name);
      this.locationError.name = errorName || 'Error';
      throw this.locationError;
    }
    console.log('location found', location.coords);
    return location.coords;
  }
  this.pushContext('doYield');
  this.pushContext();
};

// disable new version update notice
WebSocketManager.MessageHandlers['new-version-available'] = function() {
  console.debug('New netsblox version available, check for updates.');
};


// fix keyboard text input
// TODO zoom in zoom out issue. maybe by optimizing the input size or dynamic zooming
CursorMorph.prototype.set = function (value) {
  this.target.text = value;
  this.target.changed();
  this.target.drawNew();
  this.target.changed();
  this.gotoSlot(this.target.endOfLine(this.slot));
};

WorldMorph.prototype._initVirtualKeyboard = WorldMorph.prototype.initVirtualKeyboard;
WorldMorph.prototype.initVirtualKeyboard = function() {
  this._initVirtualKeyboard();

  // change styling
  this.virtualKeyboard.style['z-index'] = -1;
  this.virtualKeyboard.style['font-size'] = '20px'; // bigger font size prevents zooming on focus
  this.virtualKeyboard.style.width = '10px';
  this.virtualKeyboard.style.height = '10px';


  // add listener to keep snap input updated
  this.virtualKeyboard.addEventListener('input', e => {
    let val = this.virtualKeyboard.value;
    this.keyboardReceiver.set(val);
  });
  this.virtualKeyboard.value = '';
  this.virtualKeyboard.focus();
};

// remove the top position for virt keyboard
WorldMorph.prototype._edit = WorldMorph.prototype.edit;
WorldMorph.prototype.edit = function (aStringOrTextMorph) {
  this._edit(aStringOrTextMorph);
  if (this.virtualKeyboard) this.virtualKeyboard.style.top = '';
};


// set the fillpage option on creating world instance
WorldMorph.prototype._init = WorldMorph.prototype.init;
WorldMorph.prototype.init = function(aCanvas, fillPage) {
  // if (fillPage === true) console.warn('fillpage option is disabled in mobileMode');
  return this._init(aCanvas, true);
};


disableRetinaSupport(); // lower quality => better performance

// should snap eatup all exceptions?
Process.prototype.isCatchingErrors = false;

// explicitly set that this is a touch device to avoid problems
// if there has not been any touches yet (initKeyboard)
MorphicPreferences.isTouchDevice = true;

// disable automatic client bug reporting?
NetsBloxMorph.prototype.submitBugReport = nop;
const reportClientBugs = false;
SnapActions.completeAction = function(error) {
  if (reportClientBugs && error) {
    this.ide().submitBugReport(null, error);
  }
  return ActionManager.prototype.completeAction.apply(this, arguments);
};


window.onerror = function(message, source, lineno, colno, error) {
  let event = new CustomEvent('snapError', {
    detail: {message, error}
  });
  mobileHandle.eventTarget.dispatchEvent(event);
  return false; // don't interrupt the error flow
};

// don't create buttons on mobilemode
IDE_Morph.prototype.mobileMode.fixLayout = function() {};

// remove leaving confirmation
window.onbeforeunload = nop;

// finds all key listeners for the current role.
// CHECK custom blocks
// can be refactored and used as a way of finding all blocks of certaion type in the current role
IDE_Morph.prototype.findAllListeners = function() {
  let ide = this;
  let allSprites = ide.stage.children
    .filter(m => m instanceof SpriteMorph);
  allSprites.push(ide.stage); // also look into stage scripts

  let allTopBlocks = allSprites
    .map(sp => sp.scripts)
    .map(sc => sc.children)
    .reduce((a, b) => a.concat(b));
  // TODO filter to hat blocks only?
  // find interesting blocks
  const impSelectors = ['receiveKey', 'reportKeyPressed'];
  let impBlocks = [];
  allTopBlocks.forEach(b => {
    SnapActions.traverse(b, block => {
      if (impSelectors.includes(block.selector)) impBlocks.push(block);
    });
  });
  // pull out the interesting section of the blocks
  const listeners = impBlocks
    .map(b => {
      return b.children.find(child => child instanceof InputSlotMorph);
    })
    .map(is => {
      if (is.constant) return is.constant[0];
    });

  // set also takes care of duplicate values
  return new Set(listeners);
};


// capture yes no dialog boxes
DialogBoxMorph.prototype.askYesNo = function(title, textString, world, pic) {
  console.log('overriding dialog', this);
  mobileHandle.parent.dialogs.confirm(textString, title, ['Yes', 'No'])
    .then(selection => { // 0,2 == no
      if (selection === 1) {
        console.log('accepted');
        this.accept();
      } else {
        console.log('canceled');
        this.cancel();
      }
    })
    .catch(e => console.error('Error displaying dialog', e));
};

