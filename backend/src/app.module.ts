import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Charger les variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configurer JWT de façon asynchrone
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('PASS'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),

    // Configurer TypeORM de façon asynchrone
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbPassword = configService.get<string>('DB_PASSWORD');
        console.log('Database Password:', dbPassword, typeof dbPassword); // Debug

        if (!dbPassword || typeof dbPassword !== 'string') {
          throw new Error('Database password is missing or invalid.');
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<number>('DB_PORT')),
          username: configService.get<string>('DB_USER'),
          password: dbPassword,
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // ⚠️ Désactiver en production
        };
      },
      inject: [ConfigService],
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
