/* eslint-disable func-names */
function MyCellEditor() {}

// gets called once before the renderer is used
MyCellEditor.prototype.init = function (params) {
  // create the cell
  this.eInput = document.createElement('input');
  this.eInput.setAttribute('type', 'number');
  this.eInput.setAttribute('step', 0.01);
  this.eInput.setAttribute('min', 0);
  this.eInput.value = params.value;
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
