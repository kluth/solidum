import { webml } from '@sldm/core';

export default function template(props: any) {
  return webml`<button
  class="${props.classes}"
  ${props.disabled ? `disabled` : ''}
  type="button"
  ${props.onClick ? `onclick="${props.onClick}"` : ''}
  ${props.restAttrs}
>
  ${props.children}
</button>`;
}
