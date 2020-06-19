export function getScrollParent(node) {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const overflowX = isElement && window.getComputedStyle(node).overflowX;
  const isScrollableY = overflowY && overflowY !== 'visible' && overflowY !== 'hidden';
  const isScrollableX = overflowX && overflowX !== 'visible' && overflowX !== 'hidden';
  if (!node) {
    return null;
  }
  if (isScrollableY && node.scrollHeight >= node.clientHeight) {
    return node;
  }
  if (isScrollableX && node.scrollWidth >= node.clientWidth) {
    return node;
  }

  return getScrollParent(node.parentNode) || document.body;
}

// export function raf(fn) {
//   let running = false;

//   return (...args) => {
//     if (running) return;

//     running = true;

//     window.requestAnimationFrame(() => {
//       fn.apply(this, args);
//       running = false;
//     });
//   };
// }



export const raf = callback => {
  let requestId;

  const later = (context, args) => () => {
    requestId = null;
    callback.apply(context, args);
  };

  const throttled = function throttled(...args) {
    if (requestId === null || requestId === undefined) {
      requestId = requestAnimationFrame(later(this, args));
    }
  };

  throttled.cancel = () => cancelAnimationFrame(requestId);

  return throttled;
};
