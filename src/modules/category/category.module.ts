/**
 * @file Category module
 * @module module/category/module

 */

import { Module } from '@nestjs/common'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { ArticleProvider } from '@app/modules/article/article.model'
import { CategoryController } from './category.controller'
import { CategoryProvider } from './category.model'
import { CategoryService } from './category.service'

@Module({
  imports: [ArchiveModule],
  controllers: [CategoryController],
  providers: [ArticleProvider, CategoryProvider, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
