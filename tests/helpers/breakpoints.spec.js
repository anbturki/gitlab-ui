import bp from '../../src/utils/breakpoints';

describe('breakpoints', () => {
  describe.each`
    key     | size    | expectedDesktop
    ${'xl'} | ${1200} | ${true}
    ${'lg'} | ${992}  | ${true}
    ${'md'} | ${768}  | ${false}
    ${'sm'} | ${576}  | ${false}
    ${'xs'} | ${0}    | ${false}
  `('$key', ({ size, key, expectedDesktop }) => {
    beforeEach(() => {
      jest.spyOn(bp, 'windowWidth').mockImplementationOnce(() => size + 10);
    });

    it(`returns ${key} when larger than ${size}`, () => {
      expect(bp.getBreakpointSize()).toBe(key);
    });

    describe('isDesktop', () => {
      it(`returns ${expectedDesktop} when screen size is ${size}`, () => {
        expect(bp.isDesktop()).toBe(expectedDesktop);
      });
    });
  });
});
