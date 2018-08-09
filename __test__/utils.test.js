import raf from 'raf';
import { getScrollParent, raf as rafThrottle } from '../src/list/utils';

describe('getScrollParent', () => {
  it('should return null ', () => {
    const parent = getScrollParent('');
    expect(parent).toBe(null);
  });
  it('window', () => {
    const node = document.createElement('div');
    document.body.appendChild(node);
    const parent = getScrollParent(node);
    expect(parent).toBe(document.body);
  });

  it('scrollable container', () => {
    const node1 = document.createElement('div');
    const node2 = document.createElement('div');
    node1.style.overflowY = 'scroll';
    node1.appendChild(node2);
    document.body.appendChild(node1);
    const parent = getScrollParent(node2);
    expect(parent).toBe(node1);
  });
});

test('throttle', done => {
  expect.assertions(1)

  const callbackSpy = jest.fn()

  const throttled = rafThrottle(callbackSpy)
  throttled()
  throttled()

  raf(() => {
    expect(callbackSpy.mock.calls.length).toBe(1)
    done()
  })
})