class HorizontalVirtualList {
  constructor({ wrapEle, contentEle, items, itemWidth }) {
    if (!wrapEle || typeof wrapEle === 'undefined') {
      this.wrapEle = window;
    } else {
      this.wrapEle = wrapEle;
    }
    this.wrap = this.wrapSize(this.wrapEle);
    this.content = this.contentSize(contentEle, itemWidth, items.length);
    this.itemWidth = itemWidth;
  }

  leftOffset(el) {
    if (typeof el === 'undefined' || !el) {
      return 0;
    }
    return (el.offsetLeft || 0) + this.leftOffset(el.offsetParent);
  }

  wrapSize(el) {
    const width = el.clientWidth || el.innerWidth;
    const leftOffset = this.leftOffset(el);
    return {
      width,
      leftOffset,
      rightOffset: leftOffset + width,
    };
  }

  contentSize(el, itemWidth, count) {
    const width = itemWidth * count;
    const leftOffset = this.leftOffset(el);
    return {
      width,
      leftOffset,
    };
  }

  getScrollLeft = el => {
    if (el.pageXOffset) return el.pageXOffset;
    return el.scrollX || el.scrollLeft || 0;
  };

  getVisibleIndex() {
    const wrapScrollLeft = this.getScrollLeft(this.wrapEle);

    const contentLeft = this.content.leftOffset - this.wrap.leftOffset;
    const visibleLeftIndex = Math.floor(
      (wrapScrollLeft - contentLeft) / this.itemWidth,
    );
    const visibleItemsLength = Math.ceil(this.wrap.width / this.itemWidth);
    const startIdx = Math.max(0, visibleLeftIndex);
    const endIdx = startIdx + visibleItemsLength;

    // console.log(startIdx, endIdx);

    return {
      startIdx,
      endIdx,
    };
  }
}

export default HorizontalVirtualList;
