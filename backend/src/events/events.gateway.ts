import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyDto } from './dto/join-lobby.dto';

enum lobbyEvents {
  joinLobby = 'join-lobby',
  play = 'play',
}

@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('lobby')
  joinLobby(@MessageBody() data: LobbyDto, @ConnectedSocket() client: Socket) {
    console.log('Receive message from client', data);
    if (data.event === lobbyEvents.joinLobby) {
      client.join(data.roomId);
      this.server.to(data.roomId).emit('lobby', {
        event: lobbyEvents.joinLobby,
      });
    }
    if (data.event === lobbyEvents.play) {
      this.server.to(data.roomId).emit('lobby', {
        event: lobbyEvents.play,
      });
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}, ${args}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   console.log(data);
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }
}
