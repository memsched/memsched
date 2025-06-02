/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import * as FormPrimitive from 'formsnap';

import Button from './form-button.svelte';
import Description from './form-description.svelte';
import ElementField from './form-element-field.svelte';
import Field from './form-field.svelte';
import FieldErrors from './form-field-errors.svelte';
import Fieldset from './form-fieldset.svelte';
import Label from './form-label.svelte';
import Legend from './form-legend.svelte';

const Control = FormPrimitive.Control;

export {
  Button,
  Control,
  Description,
  ElementField,
  Field,
  FieldErrors,
  Fieldset,
  Button as FormButton,
  Control as FormControl,
  Description as FormDescription,
  ElementField as FormElementField,
  //
  Field as FormField,
  FieldErrors as FormFieldErrors,
  Fieldset as FormFieldset,
  Label as FormLabel,
  Legend as FormLegend,
  Label,
  Legend,
};
