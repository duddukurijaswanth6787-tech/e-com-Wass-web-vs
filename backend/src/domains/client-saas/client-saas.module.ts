import { Module } from '@nestjs/common';
import { ClientSaaSController } from './client-saas.controller';

@Module({
  controllers: [ClientSaaSController],
})
export class ClientSaaSModule {}
