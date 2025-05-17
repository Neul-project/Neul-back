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
    async chatList(@Query('userId') userId: number, @Query('page') page: number, @Query('limit') limit: number){
        console.log(userId, '채팅목록 사용자id')
        return this.chatService.getChatList(userId, +page, +limit);
    }

    // 채팅방목록 전달
    @Get('/rooms')
    @ApiResponse({type: ChatRoomListDto})
    async chatroomList(@Query('adminId') adminId: number, @Query('page') page: number, @Query('limit') limit: number){
        return this.chatService.getChatroomList(adminId, +page, +limit);
    }

    // 읽음처리 (관리자)
    @Post('/read')
    async chattingRead(@Body() body){
        return this.chatService.chatRead(body.adminId, body.userId);
    }

    // 읽음처리 (사용자)
    @Post('/user/read')
    async chattingReadUser(@Body() body){
        return this.chatService.chatReadUser(body.adminId, body.userId);
    }

    // 채팅내역 삭제 (사용자)
    @Delete('/alldelete')
    async chatDelete(@Query('userId') userId: number){
        return this.chatService.chatDel(userId);
    }

    // 안 읽은 채팅 개수 전달 (사용자)
    @Get('/unreadCount')
    @UseGuards(JwtAuthGuard)
    async chatCount(@Req() req){
        const userId = req.user.id
        return this.chatService.chatCount(userId);
    }
}
