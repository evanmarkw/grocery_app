export interface RecipeIngredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
}

export interface Recipe {
  id: number;
  name: string;
  name_chinese: string;
  linked_product_id: number;
  linked_product_name: string;
  cuisine: string;
  difficulty: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  servings: number;
  description: string;
  description_chinese: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  tips: string[];
  serving_suggestions: string[];
  nutrition_notes: string;
  storage: string;
  recipe_source: string;
  tags: string[];
  image_filename: string;
}

export interface RecipeData {
  recipes: Recipe[];
}