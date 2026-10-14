import '@fontsource/poppins/latin-ext-400.css';
import '@fontsource/poppins/latin-ext-500.css';
import '@fontsource/poppins/latin-ext-600.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/poppins/latin-ext-700.css';
import '../legacy/style.css';
import '../legacy/refinement.css';
import '../legacy/pricing-journal.css';
import '../legacy/construction-timeline.css';
import '../legacy/team.css';
import '../legacy/offer-journal-refinement.css';
import '../legacy/visual-system.css';
import '../legacy/refield-team-footer.css';
import '../legacy/shared-cta-team-heading.css';
import './figma-match.css';
import { RefieldHeader } from '../components/layout/RefieldHeader';
import { themeScript } from '../data/header';
import './refield-system.css';
import { SiteEffects } from '../components/layout/SiteEffects';

export const metadata = { title: 'Nektarowa — Refield Homes', description: 'Nektarowa by Refield Homes. Domy, które podnoszą standard codzienności.' };
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f4f4f4' }, { media: '(prefers-color-scheme: dark)', color: '#112420' }] };
export default function RootLayout({ children }) { return <html lang="pl" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><RefieldHeader />{children}<SiteEffects /></body></html>; }
