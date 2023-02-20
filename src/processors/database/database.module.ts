/**
 * @file Database module
 * @module processor/database/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global } from '@nestjs/common'
import { databaseProvider } from './database.provider'

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
