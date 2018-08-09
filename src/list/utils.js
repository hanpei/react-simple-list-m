export function getScrollParent(node) {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY && overflowY !== 'visible' && overflowY !== 'hidden';
  if (!node) {
    return null;
  }
  if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getScrollParent(node.parentNode) || document.body;
}

export function raf(fn) {
  let running = false;

  return (...args) => {
    if (running) return;

    running = true;

    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      running = false;
    });
  };
}



// export const rafThrottle = callback => {
//   let requestId;

//   const later = (context, args) => () => {
//     requestId = null;
//     callback.apply(context, args);
//   };

//   const throttled = function throttled(...args) {
//     console.log(args);
//     if (requestId === null || requestId === undefined) {
//       console.log('raf');
//       requestId = requestAnimationFrame(later(this, args));
//     }
//   };

//   throttled.cancel = () => cancelAnimationFrame(requestId);

//   return throttled;
// };
