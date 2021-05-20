import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/news/entites/news.entity';
import { School } from 'src/schools/entities/schools.entity';
import { UserSchoolFollow } from 'src/user-school-follow/entites/user-school-follow.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { User } from './entities/users.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSchoolManage,
      News,
      UserSchoolFollow,
      School,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}d`,
        },
      }),
    }),
    ConfigService,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
