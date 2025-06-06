import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";

@WebSocketGateway()
export class ChatGateway{
    constructor(private readonly chatService: ChatService) {}

    @WebSocketServer()
    server: Server; // 웹소켓 인스턴스 생성
    
    handleConnection(client: Socket){
        console.log(`✅ Client 연결: ${client.id}`)
    }
    handleDisconnect(client: Socket) {
        console.log(`❌ Client 연결 종료: ${client.id}`);
    }

    @SubscribeMessage('send_message') // 메시지 수신 처리
    async handleMessage(
        @MessageBody() data: { roomId: number; message: string, sender: 'user' | 'admin' },
        @ConnectedSocket() client: Socket,
    ){
        const saved = await this.chatService.saveChat(data); // db 저장
        this.server.emit('receive_message', saved); // 저장된 메시지 브로드캐스트
    }
}