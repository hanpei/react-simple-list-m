export function getScrollParent(node) {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

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

  return () => {
    if (running) return;
    running = true;

    window.requestAnimationFrame(() => {
      console.log('raf');
      fn();
      running = false;
    });
  };
}
