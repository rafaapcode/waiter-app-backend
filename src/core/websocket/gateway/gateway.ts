import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'] })
export class OrderGateway {}
