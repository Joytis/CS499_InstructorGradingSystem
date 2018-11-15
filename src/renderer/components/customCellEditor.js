/* eslint-disable func-names, prefer-destructuring */
function MyCellEditor() {}

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

// gets called once before the renderer is used
MyCellEditor.prototype.init = function (params) {
  // create the cell
  this.eInput = document.createElement('input');
  this.eInput.setAttribute('type', 'number');
  this.eInput.setAttribute('step', 0.01);
  this.eInput.setAttribute('min', 0);
  this.eInput.value = params.value;
  this.eInput.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;
    const isNavigationKey = keyCode === KEY_LEFT || keyCode === KEY_RIGHT || keyCode === KEY_UP
    || keyCode === KEY_DOWN;
    if (isNavigationKey) {
      // this stops the grid from receiving the event and executing keyboard navigation
      event.stopPropagation();
    }
  });
};

// gets called once when grid ready to insert the element
MyCellEditor.prototype.getGui = function () {
  return this.eInput;
};

// focus and select can be done after the gui is attached
MyCellEditor.prototype.afterGuiAttached = function () {
  this.eInput.focus();
  this.eInput.select();
};

// returns the new value after editing
MyCellEditor.prototype.getValue = function () {
  return this.eInput.value;
};

// any cleanup we need to be done here
MyCellEditor.prototype.destroy = function () {
  // but this example is simple, no cleanup, we could
  // even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
MyCellEditor.prototype.isPopup = function () {
  // and we could leave this method out also, false is the default
  return false;
};

export default MyCellEditor;
