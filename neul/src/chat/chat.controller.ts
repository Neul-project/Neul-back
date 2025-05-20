import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiResponse } from '@nestjs/swagger';
import { ChatListDTO } from './dto/res/chat-list.dto';
import { ChatRoomListDto } from './dto/res/chatroom-list.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UsersIdDto } from './dto/req/users-id.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // 채팅목록 전달
    @Get('/list')
    @ApiResponse({type: ChatListDTO})
    async chatList(@Query('userId') userId: number, @Query('page') page: number, @Query('limit') limit: number){
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
    async chattingRead(@Body() dto: UsersIdDto){
        return this.chatService.chatRead(dto.adminId, dto.userId);
    }

    // 읽음처리 (사용자)
    @Post('/user/read')
    async chattingReadUser(@Body() dto: UsersIdDto){
        return this.chatService.chatReadUser(dto.adminId, dto.userId);
    }

    // 채팅내역 삭제 (사용자)
    @Delete('/alldelete')
    async chatDelete(@Query('userId') userId: number){
        return this.chatService.chatDel(userId);
    }

    // 안 읽은 채팅 개수 전달 (사용자)
    @Get('/unreadCount')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({schema: {example: {unreadCount: 3}}})
    async chatCount(@Req() req){
        const userId = req.user.id
        return this.chatService.chatCount(userId);
    }

    // 채팅방 삭제
    @Delete('/exitRoom')
    async roomExit(@Query('roomId') roomId: number){
        return this.chatService.roomExit(roomId);
    }
}
