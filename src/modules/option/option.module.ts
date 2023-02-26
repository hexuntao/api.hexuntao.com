/**
 * @file Option module
 * @module module/option/module

 */

import { Module } from '@nestjs/common'
import { OptionController } from './option.controller'
import { OptionProvider } from './option.model'
import { OptionService } from './option.service'

@Module({
  controllers: [OptionController],
  providers: [OptionProvider, OptionService],
  exports: [OptionService],
})
export class OptionModule {}
