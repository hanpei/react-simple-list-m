import VirtualList from '../src/list/virtualList';

describe('VirtualList', () => {
  it('is a class', () => {
    const props = {
      wrapEle: null,
      contentEle: null,
      items: [],
      itemHeight: 10,
    };
    const list = new VirtualList(props);
    expect(list instanceof VirtualList).toBeTruthy();
  });

  it('props', () => {
    const fakeWrapEle = {
      innerHeight: 500,
      pageYOffset: 100,
    };
    const fakeContentEle = {
      offsetTop: 10,
      offsetParent: {
        offsetTop: 20,
      },
    };
    const items = [1, 2, 3, 4, 5];
    const list = new VirtualList({
      wrapEle: fakeWrapEle,
      contentEle: fakeContentEle,
      items,
      itemHeight: 50,
    });

    const wrapSize = list.wrapSize(fakeWrapEle);
    expect(list.wrap).toMatchObject(wrapSize);

    const contentSize = list.contentSize(fakeContentEle, 50, items.length);
    expect(list.content).toMatchObject(contentSize);

    expect(list.wrapEle).toBe(fakeWrapEle);
    expect(list.itemHeight).toBe(50);
  });

  it('without wrapEle', () => {
    const fakeContentEle = {
      offsetTop: 10,
      offsetParent: {
        offsetTop: 20,
      },
    };
    const items = [1, 2, 3, 4, 5];
    const list = new VirtualList({
      contentEle: fakeContentEle,
      items,
      itemHeight: 50,
    });
    expect(list.wrapEle).toBe(window);
  });

  it('getVisibleIndex', () => {
    const fakeWrapEle = {
      innerHeight: 500,
      scrollTop: 10,
    };

    const fakeContentEle = {
      offsetTop: 0,
    };
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const list = new VirtualList({
      wrapEle: fakeWrapEle,
      contentEle: fakeContentEle,
      items,
      itemHeight: 100,
    });
    const result = list.getVisibleIndex();
    expect(result).toEqual({
      startIdx: 0,
      endIdx: 4,
    });
  });
  it('getVisibleIndex when scroll down', () => {
    const fakeWrapEle = {
      innerHeight: 500,
      pageYOffset: 200,
    };

    const fakeContentEle = {
      offsetTop: 0,
    };
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const list = new VirtualList({
      wrapEle: fakeWrapEle,
      contentEle: fakeContentEle,
      items,
      itemHeight: 100,
    });
    const result = list.getVisibleIndex();
    expect(result).toEqual({
      startIdx: 2,
      endIdx: 6,
    });
  });
});
