/* eslint-disable func-names, no-param-reassign, no-console */
// interface ValueGetterParams {
//     oldValue: any, // the value before the change
//     newValue: any, // the value after the change
//     data: any, // the data you provided for this row
//     node: RowNode, // the row node for this row
//     colDef: ColDef, // the column def for this column
//     column: Column, // the column for this column
//     api: GridApi, // the grid API
//     columnApi: ColumnApi, // the grid Column API
//     context: any  // the context
// }

const myValueSetter = (params) => {
  // see if values are different, if you have a complex object,
  // it would be more complicated to do this.
  params.newValue = Number(params.newValue);
  if (params.oldValue === params.newValue || params.newValue < 0) {
    return false;
  }
  // no change, so no refresh needed
  params.data[params.colDef.field] = params.newValue;
  return true;
};

export default myValueSetter;
