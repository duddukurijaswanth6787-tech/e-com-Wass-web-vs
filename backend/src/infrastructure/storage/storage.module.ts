import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STORAGE_PROVIDER } from './storage.constants';
import { LocalStorageProvider } from './local-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
import { StorageService } from './storage.service';
import { StorageServeController } from './storage-serve.controller';

@Global()
@Module({
  controllers: [StorageServeController],
  providers: [
    LocalStorageProvider,
    S3StorageProvider,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (
        configService: ConfigService,
        localProvider: LocalStorageProvider,
        s3Provider: S3StorageProvider,
      ) => {
        const provider = configService.get<string>(
          'app.storage.provider',
          's3',
        );
        const bucket = configService.get<string>('app.storage.s3.bucket', '');
        if (provider === 's3' || bucket) {
          return s3Provider;
        }
        return localProvider;
      },
      inject: [ConfigService, LocalStorageProvider, S3StorageProvider],
    },
    StorageService,
  ],
  exports: [StorageService, STORAGE_PROVIDER],
})
export class StorageModule {}
