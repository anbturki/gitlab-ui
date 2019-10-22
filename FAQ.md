# Frequently asked questions

## What icons library do we use in GitLab UI?

GitLab has its own SVG icons library, explore it here: https://gitlab-org.gitlab.io/gitlab-svgs/

## How can I import icons from GitLab SVGs into GitLab UI components?

We're [working](https://gitlab.com/gitlab-org/gitlab-ui/merge_requests/644) on adding an `<icon>` component to GitLab UI, which will make it super easy to display icons in any component. In the meantime, you can leverage the `getSvgIconPathContent()` utility to render SVG paths in components' templates. Have a look at the [`<toggle>`](https://gitlab.com/gitlab-org/gitlab-ui/blob/7563c357c37762a6726b3e83ecba12837f36ed10/components/base/toggle/toggle.vue#L81-88) component for an example.

## Why don’t we generate utilities?

When looking at [utility-mixins.scss](src/scss/utility-mixins.scss), you might wonder _"Why don't we take advantage of SCSS maps, loops and other goodies to generate all those mixins in a more DRY manner?"_. We chose this declarative approach because anyone not familiar with GitLab UI's styles can easily get a grasp of what utilities are available by reading the file, no need to decipher some complex loop.
