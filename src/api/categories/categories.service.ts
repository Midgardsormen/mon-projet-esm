import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Injectable } from '@nestjs/common';
import type { CreateCategoryDto } from '../../dto/create-category.dto.js';


@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      throw new Error(error.message);
    }

    // Construire une hiérarchie (catégories principales avec sous-catégories)
    return this.buildCategoryTree(data);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([createCategoryDto])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async update(id: string, updateData: Partial<CreateCategoryDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
 * Organise les catégories en hiérarchie
 */
  private buildCategoryTree(categories: any[]) {
    const categoryMap = new Map(
      categories.map((cat) => [cat.id, { ...cat, children: [] }])
    );

    const tree = [];
    for (const category of categories) {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        tree.push(categoryMap.get(category.id));
      }
    }

    return tree;
  }
}
