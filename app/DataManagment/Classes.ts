// Classes.ts

// 👇 wspólna klasa bazowa
export class BaseItem {
  id: number;
  name: string;
  desc: string | null;

  constructor(id: number, name: string, desc: string | null = null) {
    this.id = id;
    this.name = name;
    this.desc = desc;
  }
}

export class Instruction {
  id: number;
  step_number: number;
  instruction: string;

  constructor(id: number, step_number: number, instruction: string) {
    this.id = id;
    this.step_number = step_number;
    this.instruction = instruction;
  }
}

export class PrepIngredient {
  id: number;
  ingredient_text: string;

  constructor(id: number, ingredient_text: string) {
    this.id = id;
    this.ingredient_text = ingredient_text;
  }
}

// 👇 osobna klasa na szczegóły (instrukcje + składniki do przygotowania)
export class DrinkDetails {
  instructions: Instruction[];
  prepIngredients: PrepIngredient[];

  constructor(instructions: Instruction[], prepIngredients: PrepIngredient[]) {
    this.instructions = instructions;
    this.prepIngredients = prepIngredients;
  }
}

// 👇 główna klasa pełnego drinka
export class DrinkFull {
  id: number;
  name: string;
  description: string;
  img: string | null;
  points_max: number | null;
  range: string | null;
  strength: BaseItem | null;
  alcohols: BaseItem[];
  ingredients: BaseItem[];
  tastes: BaseItem[];
  percentage?: number;
  points?: number;
  maxPoints?: number;

  constructor(
    id: number,
    name: string,
    description: string,
    img: string | null,
    points_max: number | null,
    range: string | null,
    strength: BaseItem | null,
    alcohols: BaseItem[],
    ingredients: BaseItem[],
    tastes: BaseItem[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.img = img;
    this.points_max = points_max;
    this.range = range;
    this.strength = strength;
    this.alcohols = alcohols;
    this.ingredients = ingredients;
    this.tastes = tastes;
  }
}

export class DrinkSimple {
  id: number;
  name: string;
  img: string | null;
  range: string | null;
  percentage?: number;

  constructor(id: number, name: string, img: string, range: string) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.range = range;
  }
}
