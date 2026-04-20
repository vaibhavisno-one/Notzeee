import { Server as SocketIOServer } from "socket.io";
import { createCorsOriginValidator, getAllowedOrigins } from "../config/cors.js";
import { socketAuthMiddleware } from "./socketAuth.js";
import { registerNoteCollabNamespace } from "./noteCollabSocket.js";

export const initializeSocketServer = (httpServer) => {
    const allowedOrigins = getAllowedOrigins();

    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: createCorsOriginValidator(allowedOrigins),
            credentials: true,
        },
    });

    io.of("/notes-collab").use(socketAuthMiddleware);
    registerNoteCollabNamespace(io);

    return io;
};
