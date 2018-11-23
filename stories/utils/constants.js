function appendDefaultOption(options) {
  return Object.assign({}, options, {
    default: '',
  });
}

export const variantOptions = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  light: 'light',
  dark: 'dark',
};

export const targetOptions = {
  self: '_self',
  blank: '_blank',
  parent: '_parent',
  top: '_top',
  null: '',
};

export const sizeOptions = {
  sm: 'sm',
  lg: 'lg',
};

export const buttonVariantOptions = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  link: 'link',
  'outline-primary': 'outline-primary',
  'outline-secondary': 'outline-secondary',
  'outline-success': 'outline-success',
  'outline-warning': 'outline-warning',
  'outline-danger': 'outline-danger',
};

export const triggerVariantOptions = {
  click: 'click',
  hover: 'hover',
  focus: 'focus',
};

export const tooltipPlacements = {
  top: 'top',
  left: 'left',
  right: 'right',
  bottom: 'bottom',
};

export const popoverPlacements = {
  top: 'top',
  topleft: 'topleft',
  topright: 'topright',
  right: 'right',
  righttop: 'righttop',
  rightbottom: 'rightbottom',
  bottom: 'bottom',
  bottomleft: 'bottomleft',
  bottomright: 'bottomright',
  left: 'left',
  lefttop: 'lefttop',
  leftbottom: 'leftbottom',
};

export const variantOptionsWithNoDefault = appendDefaultOption(variantOptions);
export const sizeOptionsWithNoDefault = appendDefaultOption(sizeOptions);
