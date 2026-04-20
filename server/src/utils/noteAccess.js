export const getUserRoleForNote = (note, userId) => {
    if (!note || !userId) return null;

    const normalizedUserId = userId.toString();
    const ownerId = (note.owner?._id || note.owner)?.toString();

    if (ownerId === normalizedUserId) {
        return "owner";
    }

    const collaborator = (note.collaborators || []).find((collab) => {
        const collaboratorUserId = (collab.user?._id || collab.user)?.toString();
        return collaboratorUserId === normalizedUserId;
    });

    return collaborator?.role || null;
};

export const canReadNoteForUser = (note, userId) => {
    return Boolean(getUserRoleForNote(note, userId));
};

export const canEditNoteForUser = (note, userId) => {
    const role = getUserRoleForNote(note, userId);
    return role === "owner" || role === "editor";
};
