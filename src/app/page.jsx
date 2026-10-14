import markup from '../data/page-markup.json';
import SiteInteractions from '../components/SiteInteractions';
export default function Page() {
 return <><div id="refield-site" dangerouslySetInnerHTML={{ __html: markup }} /><SiteInteractions /></>;
}
