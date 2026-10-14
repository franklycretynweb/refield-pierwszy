'use client';
import { useEffect } from 'react';
import { initializeSite } from '../legacy/interactions';
import { initializeReadingEffects } from '../legacy/reading-effects';
import { initializeBenefitAccordions } from '../legacy/benefit-accordions';
export default function SiteInteractions() {
 useEffect(() => {
   const root = document.getElementById('refield-site');
   const controller = new AbortController();
   const cleanupReading = initializeReadingEffects(root, controller.signal);
   initializeSite(root, controller.signal);
   const cleanupBenefits = initializeBenefitAccordions(root, controller.signal);
   return () => {
     controller.abort();
     cleanupReading();
     cleanupBenefits();
     root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
     root.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
   };
 }, []);
 return null;
}
