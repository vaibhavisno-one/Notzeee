
import Topbar from "../../../components/Topbar";
import Editor from "../../../components/Editor";

export default async function NotePage({ params }) {
    const { id } = await params;

    return (
        <div className="flex flex-col h-full bg-neutral-900">
            <Topbar noteId={id} />
            <Editor noteId={id} />
        </div>
    );
}
