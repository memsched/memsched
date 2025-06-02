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
import Root from './textarea.svelte';

type FormTextareaEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLTextAreaElement;
};

type TextareaEvents = {
  blur: FormTextareaEvent<FocusEvent>;
  change: FormTextareaEvent<Event>;
  click: FormTextareaEvent<MouseEvent>;
  focus: FormTextareaEvent<FocusEvent>;
  keydown: FormTextareaEvent<KeyboardEvent>;
  keypress: FormTextareaEvent<KeyboardEvent>;
  keyup: FormTextareaEvent<KeyboardEvent>;
  mouseover: FormTextareaEvent<MouseEvent>;
  mouseenter: FormTextareaEvent<MouseEvent>;
  mouseleave: FormTextareaEvent<MouseEvent>;
  paste: FormTextareaEvent<ClipboardEvent>;
  input: FormTextareaEvent<InputEvent>;
};

export {
  type FormTextareaEvent,
  Root,
  //
  Root as Textarea,
  type TextareaEvents,
};
