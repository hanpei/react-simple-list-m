class VirtualList {
  constructor({ wrapEle, contentEle, items, itemHeight }) {
    if (!wrapEle || typeof wrapEle === 'undefined') {
      this.wrapEle = window;
    } else {
      this.wrapEle = wrapEle;
    }
    this.wrap = this.wrapSize(this.wrapEle);
    this.content = this.contentSize(contentEle, itemHeight, items.length);
    this.itemHeight = itemHeight;
  }

  topOffset(el) {
    if (typeof el === 'undefined' || !el) {
      return 0;
    }
    return (el.offsetTop || 0) + this.topOffset(el.offsetParent);
  }

  wrapSize(el) {
    const height = el.clientHeight || el.innerHeight;
    const topOffset = this.topOffset(el);
    return {
      height,
      topOffset,
      bottomOffset: topOffset + height,
    };
  }

  contentSize(el, itemHeight, count) {
    const height = itemHeight * count;
    const topOffset = this.topOffset(el);
    return {
      height,
      topOffset,
    };
  }

  getScrollTop = el => {
    if (el.pageYOffset) return el.pageYOffset;
    return el.scrollY || el.scrollTop || 0;
  };

  getVisibleIndex() {
    const wrapScrollTop = this.getScrollTop(this.wrapEle);

    const contentTop = this.content.topOffset - this.wrap.topOffset;
    const visibleTopIndex = Math.floor(
      (wrapScrollTop - contentTop) / this.itemHeight,
    );
    const visibleItemsLength = Math.ceil(this.wrap.height / this.itemHeight);
    const startIdx = Math.max(0, visibleTopIndex);
    const endIdx = startIdx + visibleItemsLength - 1;

    // console.log(startIdx, endIdx);

    return {
      startIdx,
      endIdx,
    };
  }
}

export default VirtualList;
