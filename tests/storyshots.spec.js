import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { getResetAnimationsCSS } from './test_utils';

registerRequireContextHook();

// subsets of stories (i.e. story kinds) that should be excluded form visual testing
// a story kind is defined by the first part of the story's name, everything before the first pipe
// e.g. `base|avatar` -> base, `directives|resize-observer-directive` -> directives
// more information: https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#storykindregex
const excludedStoryKinds = ['directives'];

const beforeScreenshot = page =>
  // Fixing the Animation by inlining, previous approach with external file was flaky for the animation
  page.addStyleTag({
    content: getResetAnimationsCSS(),
  });

const getGotoOptions = () => ({
  waitUntil: 'networkidle0',
});

const failureThreshold =
  'FAILURE_THRESHOLD' in process.env ? parseFloat(process.env.FAILURE_THRESHOLD) : 0;

const getMatchOptions = () => ({
  failureThreshold,
  failureThresholdType: 'percent',
});

initStoryshots({
  suite: 'Image storyshots',
  storyKindRegex: new RegExp(`^((?!${excludedStoryKinds.join('|')}).+)`),
  test: imageSnapshot({
    storybookUrl: 'http://localhost:9001',
    beforeScreenshot,
    getGotoOptions,
    getMatchOptions,
  }),
});
