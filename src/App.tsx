import { Routes, Route } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { TeamProvider } from "@/lib/TeamContext";
import { HomePage } from "@/pages/Home";
import { ManifestoPage } from "@/pages/Manifesto";
import { InitiativesPage } from "@/pages/Initiatives";
import { TeamPage } from "@/pages/Team";
import { MemberPage } from "@/pages/Member";
import { ContactPage } from "@/pages/Contact";
import { ProjectPage } from "@/pages/Project";
import { NotFound } from "@/pages/NotFound";

export function App() {
    return (
        <TeamProvider>
            <Routes>
                <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/manifesto" element={<ManifestoPage />} />
                <Route path="/initiatives" element={<InitiativesPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/team/:member" element={<MemberPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/projects/:project" element={<ProjectPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </TeamProvider>
    );
}
