import Sidebar from "../components/Sidebar";
import { NotesProvider } from "../context/NotesContext";

export default function AppLayout({ children }) {
    return (
        <NotesProvider>
            <div className="flex h-screen overflow-hidden bg-neutral-900 text-neutral-50">
                <Sidebar />
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {children}
                </main>
            </div>
        </NotesProvider>
    );
}
