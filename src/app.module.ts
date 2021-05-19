import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { NewsModule } from './news/news.module';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { School } from './schools/entities/schools.entity';
import { News } from './news/entites/news.entity';
import { UserSchoolFollowModule } from './user-school-follow/user-school-follow.module';
import { UserSchoolManage } from './user-school-manage/entites/user-school-manage.entity';
import { UserSchoolFollow } from './user-school-follow/entites/user-school-follow.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env' : '.env.test',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, School, News, UserSchoolFollow, UserSchoolManage],
      synchronize: true,
      logging: process.env.NODE_ENV !== 'prod',
    }),
    UsersModule,
    SchoolsModule,
    NewsModule,
    UserSchoolFollowModule,
  ],
})
export class AppModule {}
