import Calculations from './Calculations2.mjs';

function Test() {
  try {
    let mean = Calculations.Mean(1, [50, 60, 70, 80, 50, 70]);
    let median = Calculations.Median(1, [50, 60, 70, 80, 50, 70]);
    let mode = Calculations.Mode(1, [50, 60, 70, 80, 50, 70]);
    let SD = Calculations.StandardDeviation(1, [50, 60, 70, 80, 50, 70]);
    console.log(mean);
    console.log(median);
    console.log(mode);
    console.log(SD);
  } catch (err) {
    throw Error(err);
  }
}

Test();
