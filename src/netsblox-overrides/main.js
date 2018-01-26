// overriding netsblox/snap features for mobile use
console.log('overriding netsblox for mobile use');

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


// geolocation

NetsProcess.prototype.getLocation = () => {
  return {
    latitude: 36, longitude: 86
  };
};
