import { webml } from '@sldm/core';
import type { TemplateResult } from '@sldm/core';

export default function template(props: Record<string, unknown>): TemplateResult {
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
