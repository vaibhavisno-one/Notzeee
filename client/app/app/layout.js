import Sidebar from "../components/Sidebar";
import { NotesProvider } from "../context/NotesContext";

export default function AppLayout({ children }) {
    return (
        <NotesProvider>
            <div className="flex h-screen overflow-hidden bg-white text-neutral-900">
                <Sidebar />
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {children}
                </main>
            </div>
        </NotesProvider>
    );
}
