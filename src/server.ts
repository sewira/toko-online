import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import CategoryRoute from './routes/category.route';
import ProductRoute from './routes/product.route';
import OrderRoute from './routes/order.route';
import http from 'http';
import { ServerSocket } from './socket';
import { Socket, Server } from 'socket.io';
validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new CategoryRoute(), new ProductRoute(), new OrderRoute()]);

// const httpServer = http.createServer(app.app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket: Socket) => {
//   console.log(`User connected with id ${socket.id}`);

//   socket.on('disconnect', () => {
//     console.log('user disconnect');
//   });
// });
// httpServer.listen();
app.listen();
