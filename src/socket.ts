import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: {
    [id: string]: string;
  };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    });

    this.io.on('connection', this.StartListerners);
  }

  StartListerners = (socket: Socket) => {
    console.info(`pesan dari ${socket.id}`);

    socket.on('handskae', () => {
      console.info('handskae receieved');
    });

    socket.on('disconnect', () => {
      console.info('disconnect from socket io');
    });
  };
}
