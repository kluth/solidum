import { webml } from '@sldm/core';
import type { TemplateResult } from '@sldm/core';

export default function template(props: Record<string, unknown>): TemplateResult {
  return webml`<div class="${props.classes}" ${props.restAttrs}>
  ${props.children}
</div>`;
}
