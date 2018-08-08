import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getScrollParent, raf } from './utils';

export default class List extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    indexKey: PropTypes.func.isRequired,
    itemHeight: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.any),
    containerStyle: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    itemHeight: 0,
    items: [],
    containerStyle: null,
  };

  state = {
    visibleItems: [],
  };

  rafUpdate = raf(this.update.bind(this));

  componentDidMount() {
    this.init();
    this.bindEvents();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  init() {
    const { items, itemHeight } = this.props;
    this.wrapEle = getScrollParent(this.contentRef);
    this.contentHeight = items.length * itemHeight;
    this.rafUpdate();
  }

  bindEvents() {
    if (this.wrapEle === document.body) {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.rafUpdate);
    } else {
      this.wrapEle.addEventListener('scroll', this.handleScroll);
      this.wrapEle.addEventListener('resize', this.rafUpdate);
    }
  }

  removeEvents() {
    if (this.wrapEle === document.body) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.rafUpdate);
    } else {
      this.wrapEle.removeEventListener('scroll', this.handleScroll);
      this.wrapEle.removeEventListener('resize', this.rafUpdate);
    }
  }

  handleScroll = () => {
    // console.group('handleScroll');
    // console.log('handleScroll');
    // console.log('this.contentRef.clientHeight', this.contentRef.clientHeight);
    // console.log('this.contentRef.offsetTop', this.contentRef.offsetTop);
    // console.log('this.wrapEle.clientHeight', this.wrapEle.clientHeight);
    // console.log('this.wrapEle.scrollHeight', this.wrapEle.scrollHeight);
    // console.log('this.wrapEle.offsetTop', this.wrapEle.offsetTop);
    // console.log('this.wrapEle.scrollTop', this.wrapEle.scrollTop);
    // console.groupEnd();
    this.rafUpdate();
  };

  update() {
    const { items, itemHeight } = this.props;
    const { startIdx, endIdx } = this.calculate();
    this.contentHeight = items.length * itemHeight;
    if (startIdx !== this.prevStartIdx || endIdx !== this.prevEndIdx) {
      this.prevStartIdx = startIdx;
      this.prevEndIdx = endIdx;
      const topOffset = startIdx * itemHeight;
      this.setState({
        topOffset,
        visibleItems: items.slice(startIdx, endIdx),
      });
    }
  }

  calculate() {
    const { itemHeight } = this.props;
    const startIdx = Math.max(
      0,
      Math.floor(
        (this.wrapEle.scrollTop - this.contentRef.offsetTop) / itemHeight,
      ),
    );
    const visibleItemsLength =
      Math.ceil(this.wrapEle.clientHeight / itemHeight) + 1;
    const endIdx = startIdx + visibleItemsLength;
    return { startIdx, endIdx };
  }

  render() {
    const { visibleItems, topOffset } = this.state;
    const height = `${this.contentHeight}px`;
    const paddingTop = `${topOffset}px`;
    const { itemHeight, renderItem, indexKey, containerStyle } = this.props;
    const itemStyle = { height: `${itemHeight}px`, boxSizing: 'border-box' };

    return (
      <div style={{ containerStyle }}>
        <div
          ref={node => {
            this.contentRef = node;
          }}
          style={{ height, paddingTop, boxSizing: 'border-box' }}
        >
          {visibleItems.map(item => (
            <div key={indexKey(item)} style={itemStyle}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
