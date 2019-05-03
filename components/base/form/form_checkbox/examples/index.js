import FormCheckboxChecked from './form_checkbox.checked.example.vue';
import FormCheckboxUnchecked from './form_checkbox.unchecked.example.vue';
import FormCheckboxDisabled from './form_checkbox.disabled.example.vue';
import FormCheckboxCheckedDisabled from './form_checkbox.checked_disabled.example.vue';
import FormCheckboxValues from './form_checkbox.values.example.vue';
import FormCheckboxIndeterminate from './form_checkbox.indeterminant.example.vue';

export default [
  {
    name: 'Checkbox',
    items: [
      {
        id: 'form-checkbox-checked',
        name: 'Checked Form Checkbox',
        component: FormCheckboxChecked,
      },
      {
        id: 'form-checkbox-unchecked',
        name: 'Unchecked Form Checkbox',
        component: FormCheckboxUnchecked,
      },
      {
        id: 'form-checkbox-disabled',
        name: 'Disabled Form Checkbox',
        component: FormCheckboxDisabled,
      },
      {
        id: 'form-checkbox-model',
        name: 'Checked and Disabled Form Checkbox',
        component: FormCheckboxCheckedDisabled,
      },
      {
        id: 'form-checkbox-values',
        name: 'Custom Values for Form Checkbox',
        component: FormCheckboxValues,
      },
      {
        id: 'form-checkbox-indeterminate',
        name: 'Indeterminate State of Form Checkbox',
        component: FormCheckboxIndeterminate,
      },
    ],
  },
];