import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req ,HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import {  RegisterAuth } from './dto/register-auth.dto';
import {  LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenService } from './token/token.service';
import { AuthGuard } from 'src/guard/auth.guard';
import CustomRequest from 'src/interface/CustomRequest';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticlesService } from 'src/articles/articles.service';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService:JwtService,private tokenService:TokenService,private cloudinaryService:CloudinaryService,private articleService: ArticlesService) {}
@Post('register')
  async register(@Body() body:RegisterAuth){
    if(!body.username || !body.email || !body.password){
      return {status:400,message:"All fields are required"}
    }
    if(body.password.length<6){
      return {status:400,message:"Password must be atleast 6 characters long"}
    }
    if(body.password !== body.confirmPassword){ 
      return {status:400,message:"Password and Confirm Password must be same"}
     }
    return await this.authService.save({
      username: body.username,
      email: body.email,
      password:await  bcrypt.hash(body.password, 10),
    });
  }
   @Post('login')

  async login(@Body() body:LoginAuthDto,@Res({passthrough:true}) res:Response){
    if(!body.email || !body.password){
      return {status:400,message:"All fields are required"}
    }
    const user = await this.authService.findOne(body.email);
    if(!user){
      return {status:400,message:"User not found"}
    }
    
    const match = await bcrypt.compare(body.password, user.password);
    if(!match){
      return {status:400,message:"Invalid credentials"}
    }
    const accessToken = await this.jwtService.signAsync({id:user._id},{expiresIn:'7d'});
    const refreshToken =await this.jwtService.signAsync({id:user._id}); 
    const expire_at = new Date(Date.now() + 7*24*60*60*1000);
    await this.tokenService.save({
      user_id:user._id,
      token:refreshToken,
      expire_at
    });
    res.status(200);
    res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:7*24*60*60*1000});
    res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:7*24*60*60*1000});
    const obj = { username: user.username, email: user.email, profile_img: user.profile_img, role: user.role, id: user._id};
    return {token:accessToken,user:obj}
  }
  @Get('user/:id_user')
   async user(@Req() req:Request ,@Res({passthrough:true}) res:Response ,@Param('id_user') id_user:string){ 
    try{
     
    const user = await this.authService.findOneById(id_user)
    const userDetails = { username: user.username, email: user.email, profile_img: user.profile_img, role: user.role, id: user._id};
    res.status(200);
      return userDetails;
   } catch(e){
    console.log(e);
    res.status(401);
     return {message:"Invalid token"}
   }
  }
  @Post('refresh')
  async refresh(@Req() req:Request,@Res({passthrough:true}) res:Response){
  try{
    const refreshToken =req.cookies['refreshToken'];
  
     const {id} = await this.jwtService.verifyAsync(refreshToken);
     const tokenEntity = await this.tokenService.findOne({user_id:id,expire_at:{$gte:Date.now()}});
     if(!tokenEntity){
       console.log('Invalid token');
     }
     const accessToken = await this.jwtService.signAsync({id},{expiresIn:'60s'});
     const user = await this.authService.findOneById(id);
      res.status(200);
    return {token:accessToken};
  }catch(e){
    console.log('Invalid token');
  }
  }
  @Post('logout')
  async logout(@Req() req:Request,@Res({passthrough:true}) res:Response){
    const refreshToken =req.cookies['refreshToken'];
    const accessToken =req.cookies['accessToken'];
    console.log('refreshToken',refreshToken)
    await this.tokenService.delete({token:refreshToken});
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return {message:"Logged out"};
  }
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Req() req:CustomRequest,@Body() body:any,@Res({passthrough:true}) res:Response){
    if(!body.currentPassword || !body.newPassword){
      return {status:400,message:"All fields are required"}
    }
   const id = req.user_id;
  
    return await this.authService.changePassword(id,body.currentPassword,body.newPassword);
  }
  
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile_img'))
  @Post('edit-profile')
  async editProfile(@Req() req:CustomRequest,@Body() body:any,@UploadedFile() file: Express.Multer.File){
    console.log('file',file)
    console.log('body',body)
    const id = req.user_id;
    if(file){
     body.profile_img = await this.articleService.createImage(file);
    }
    console.log(body.profile_img,"profile_img")
    return await this.authService.editProfile(id,body.username,body.profile_img,body.bio);
  }
}

