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

      // Convertit la couleur hex en "r,g,b" pour chaque catégorie
      data.forEach((category) => {
        if (category.icon_color) {
          category.icon_color = this.hexToRgbString(category.icon_color);
        }
      });

    // Construire une hiérarchie (catégories principales avec sous-catégories)
    return this.buildCategoryTree(data);
  }
  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }

    if (data?.icon_color) {
      data.icon_color = this.hexToRgbString(data.icon_color);
    }
    
    return data;
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

  private hexToRgbString(hex: string): string {
    // Retire le # si présent
    hex = hex.replace(/^#/, '');
    
    // Gestion du format court #RGB
    if (hex.length === 3) {
      // Exemple #abc => #aabbcc
      hex = hex.split('').map((x) => x + x).join('');
    }
  
    // Convertit en nombre
    const num = parseInt(hex, 16);
  
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
  
    return `${r},${g},${b}`;
  }

}
