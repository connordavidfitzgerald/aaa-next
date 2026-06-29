import { Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { PageTransitionProvider } from "@/components/PageTransition";
import { TeamProvider } from "@/lib/TeamContext";
import { LocaleProvider, useLocale, type Lang } from "@/lib/locale";
import { SiteContentProvider } from "@/lib/SiteContentProvider";
import { HomePage } from "@/pages/Home";
import { ManifestoPage } from "@/pages/Manifesto";
import { InitiativesPage } from "@/pages/Initiatives";
import { TeamPage } from "@/pages/Team";
import { MemberPage } from "@/pages/Member";
import { ContactPage } from "@/pages/Contact";
import { ProjectPage } from "@/pages/Project";
import { NotFound } from "@/pages/NotFound";

// The locale-aware shell: everything below reads the active language from the
// LocaleProvider, so the data providers refetch and the UI re-renders when the
// language changes. Mounted once per language tree (English at `/`, French at
// `/fr`).
function LocaleLayout({ lang }: { lang: Lang }) {
  return (
    <LocaleProvider lang={lang}>
      <SiteContentProvider>
        <TeamProvider>
          <PageTransitionProvider>
            <Layout />
          </PageTransitionProvider>
        </TeamProvider>
      </SiteContentProvider>
    </LocaleProvider>
  );
}

// Redirects the legacy /manifesto slug to /about, preserving the active language.
function RedirectToAbout() {
  const { localizedPath } = useLocale();
  return <Navigate to={localizedPath("/about")} replace />;
}

// The same page tree, mounted under both language roots (fresh elements each
// call so the two trees never share element identity).
const pageRoutes = () => (
  <>
    <Route index element={<HomePage />} />
    <Route path="about" element={<ManifestoPage />} />
    {/* Old slug → new slug, so existing /manifesto links keep working. */}
    <Route path="manifesto" element={<RedirectToAbout />} />
    <Route path="initiatives" element={<InitiativesPage />} />
    <Route path="team" element={<TeamPage />} />
    <Route path="team/:member" element={<MemberPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="projects/:project" element={<ProjectPage />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export function App() {
  return (
    <Routes>
      <Route path="/fr" element={<LocaleLayout lang="fr" />}>
        {pageRoutes()}
      </Route>
      <Route path="/" element={<LocaleLayout lang="en" />}>
        {pageRoutes()}
      </Route>
    </Routes>
  );
}
