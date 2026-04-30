import {io, Socket} from "socket.io-client";

const SOCKET_URL = "ws://158.160.203.172:8081";

const createSocket = (): Socket =>{
    return io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: false
    });
};

export default createSocket;
