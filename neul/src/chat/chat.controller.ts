import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiResponse } from '@nestjs/swagger';
import { ChatListDTO } from './dto/res/chat-list.dto';
import { ChatRoomListDto } from './dto/res/chatroom-list.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // 채팅목록 전달
    @Get('/list')
    @ApiResponse({type: ChatListDTO})
    async chatList(@Query('userId') userId: number){
        return this.chatService.getChatList(userId);
    }

    // 채팅방목록 전달
    @Get('/rooms')
    @ApiResponse({type: ChatRoomListDto})
    async chatroomList(@Query('adminId') adminId: number){
        return this.chatService.getChatroomList(adminId);
    }

    // 읽음처리
    @Post('/read')
    async chattingRead(@Body() body){
        console.log(body, '읽음처리')
        return this.chatService.chatRead(body.adminId, body.userId);
    }

    // 채팅내역 삭제 (사용자)
    @Delete('/alldelete')
    @UseGuards(JwtAuthGuard)
    async chatDelete(@Req() req){
        const userId = req.user.id
        console.log(userId)
        return this.chatService.chatDel(userId)
    }
}
