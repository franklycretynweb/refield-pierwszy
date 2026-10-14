// Shared by snapshot generation and its browser templates. Trusted local markup only.
export function adoptRefieldArrows(text) {
 return text.replace(/<img([^>]*?)src="(?:\$\{asset\('(arrow-(?:green|white|dark)|journal-arrow)\.svg'\)\}|\/assets\/(arrow-(?:green|white|dark)|journal-arrow)\.svg)"([^>]*?)\/?\s*>/g, (_, before, a, b, after) => {
  const attrs=before+after;
  const css=attrs.match(/class="([^"]*)"/)?.[1] || 'refield-arrow';
  return `<svg class="${css}" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 });
}
