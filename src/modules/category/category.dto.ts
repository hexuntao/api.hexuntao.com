/**
 * @file Category dto
 * @module module/category/dto

 */

import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDTO } from '@app/models/paginate.model'

export class CategoryPaginateQueryDTO extends PaginateOptionDTO {}

export class CategoriesDTO {
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  category_ids: string[]
}
