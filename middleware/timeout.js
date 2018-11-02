export default function (ms) {
  return new Promise(resolve => {
    const id = setTimeout(() => {
      clearTimeout(id);
      resolve();
    }, ms);
  });
}
