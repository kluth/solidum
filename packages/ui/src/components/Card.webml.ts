import { webml } from '@sldm/core';

export default function template(props: any) {
  return webml`<div class="${props.classes}" ${props.restAttrs}>
  ${props.children}
</div>`;
}
