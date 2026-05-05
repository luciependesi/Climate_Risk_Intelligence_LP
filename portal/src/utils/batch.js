export function createBatcher(delay, callback) {
  let queue = [];
  let timer = null;

  return (item) => {
    queue.push(item);

    if (!timer) {
      timer = setTimeout(() => {
        callback(queue);
        queue = [];
        timer = null;
      }, delay);
    }
  };
}