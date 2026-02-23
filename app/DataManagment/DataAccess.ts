import { BaseItem, DrinkDetails, DrinkFull, DrinkSimple, Instruction, PrepIngredient } from './Classes';
import { openDatabase } from './db';

let dbInstance: any = null;
let currentLang: 'pl' | 'eng' | null = null;
let dbInitializing: Promise<any> | null = null;

async function getDb(lang: 'pl' | 'eng') {
  if (dbInstance && currentLang === lang) return dbInstance;

  if (!dbInitializing) {
    const dbName = lang === 'pl' ? 'drinks.db' : 'drinksEng.db';
    dbInitializing = openDatabase(dbName);
  }

  dbInstance = await dbInitializing;
  currentLang = lang;
  dbInitializing = null;
  return dbInstance;
}

interface BaseRow {
  id: number;
  name: string;
  description?: string | null;
}

export async function GetTaste(lang: 'pl' | 'eng'): Promise<BaseItem[]> {
  try {
    const db = await getDb(lang);
    const rows: BaseRow[] = await db.getAllAsync('SELECT id, name, NULL as desc FROM taste');
    return rows.map(r => new BaseItem(r.id, r.name));
  } catch (err) {
    console.error('Błąd przy GetTaste:', err);
    return [];
  }
}

export async function GetStrength(lang: 'pl' | 'eng'): Promise<BaseItem[]> {
  try {
    const db = await getDb(lang);
    const rows: BaseRow[] = await db.getAllAsync('SELECT id, name, NULL as desc FROM strength');
    return rows.map(r => new BaseItem(r.id, r.name));
  } catch (err) {
    console.error('Błąd przy GetStrength:', err);
    return [];
  }
}

export async function GetIngredients(lang: 'pl' | 'eng'): Promise<BaseItem[]> {
  try {
    const db = await getDb(lang);
    const rows: BaseRow[] = await db.getAllAsync('SELECT id, name, description FROM ingredients');
    return rows.map(r => new BaseItem(r.id, r.name, r.description));
  } catch (err) {
    console.error('Błąd przy GetIngredients:', err);
    return [];
  }
}

export async function GetAlcohol(lang: 'pl' | 'eng'): Promise<BaseItem[]> {
  try {
    const db = await getDb(lang);
    const rows: BaseRow[] = await db.getAllAsync('SELECT id, name, description FROM alcohol');
    return rows.map(r => new BaseItem(r.id, r.name, r.description));
  } catch (err) {
    console.error('Błąd przy GetAlcohol:', err);
    return [];
  }
}

interface DrinkRow {
  drink_id: number;
  drink_name: string;
  description: string | null;
  img: string | null;
  points_max: number;
  range: string | null;
  strength_id: number | null;
  strength_name: string | null;
  alcohol_id: number | null;
  alcohol_name: string | null;
  alcohol_desc: string | null;
  ingredient_id: number | null;
  ingredient_name: string | null;
  ingredient_desc: string | null;
  taste_id: number | null;
  taste_name: string | null;
}

export async function GetDrinkById(drinkId: number, lang: 'pl' | 'eng'): Promise<DrinkFull | null> {
  try {
    const db = await getDb(lang);
    const rows: DrinkRow[] = await db.getAllAsync(
      `SELECT 
         d.id as drink_id,
         d.name as drink_name,
         d.description,
         d.img,
         d.points_max,
         d.range,
         s.id as strength_id,
         s.name as strength_name,
         a.id as alcohol_id,
         a.name as alcohol_name,
         a.description as alcohol_desc,
         i.id as ingredient_id,
         i.name as ingredient_name,
         i.description as ingredient_desc,
         t.id as taste_id,
         t.name as taste_name
       FROM drinks d
       LEFT JOIN strength s ON d.strength_id = s.id
       LEFT JOIN drinkAlcohol da ON da.drink_id = d.id
       LEFT JOIN alcohol a ON da.alcohol_id = a.id
       LEFT JOIN drinkIngredients di ON di.drink_id = d.id
       LEFT JOIN ingredients i ON di.ingredient_id = i.id
       LEFT JOIN drinkTaste dt ON dt.drink_id = d.id
       LEFT JOIN taste t ON dt.taste_id = t.id
       WHERE d.id = ?`,
      [drinkId]
    );

    if (!rows || rows.length === 0) return null;

    let drink: DrinkFull | null = null;

    for (const row of rows) {
      if (!drink) {
        drink = new DrinkFull(
          row.drink_id,
          row.drink_name,
          row.description ?? '',
          row.img ?? '',
          row.points_max,
          row.range ?? '',
          row.strength_id ? new BaseItem(row.strength_id, row.strength_name ?? '') : null,
          [],
          [],
          []
        );
      }

      if (row.alcohol_id && !drink.alcohols.some(a => a.id === row.alcohol_id)) {
        drink.alcohols.push(new BaseItem(row.alcohol_id, row.alcohol_name ?? '', row.alcohol_desc));
      }
      if (row.ingredient_id && !drink.ingredients.some(i => i.id === row.ingredient_id)) {
        drink.ingredients.push(new BaseItem(row.ingredient_id, row.ingredient_name ?? '', row.ingredient_desc));
      }
      if (row.taste_id && !drink.tastes.some(t => t.id === row.taste_id)) {
        drink.tastes.push(new BaseItem(row.taste_id, row.taste_name ?? ''));
      }
    }

    return drink;
  } catch (err) {
    console.error('Błąd przy GetDrinkById:', err);
    return null;
  }
}

export async function GetDrinkDetails(drinkId: number, lang: 'pl' | 'eng'): Promise<DrinkDetails | null> {
  try {
    const db = await getDb(lang);
    const instructionRows: { id: number; step_number: number; instruction: string }[] =
      await db.getAllAsync('SELECT id, step_number, instruction FROM drinkInstructions WHERE drink_id = ? ORDER BY step_number ASC', [drinkId]);
    const prepIngredientRows: { id: number; ingredient_text: string }[] =
      await db.getAllAsync('SELECT id, ingredient_text FROM drinkPrepIngredients WHERE drink_id = ?', [drinkId]);

    const instructions = instructionRows.map(r => new Instruction(r.id, r.step_number, r.instruction));
    const prepIngredients = prepIngredientRows.map(r => new PrepIngredient(r.id, r.ingredient_text));

    return new DrinkDetails(instructions, prepIngredients);
  } catch (err) {
    console.error('Błąd przy GetDrinkDetails:', err);
    return null;
  }
}

export async function GetRandomDrink(lang: 'pl' | 'eng'): Promise<DrinkFull | null> {
  try {
    const db = await getDb(lang);
    const ids: { id: number }[] = await db.getAllAsync('SELECT id FROM drinks');
    if (!ids || ids.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * ids.length);
    return await GetDrinkById(ids[randomIndex].id, lang);
  } catch (err) {
    console.error('Błąd przy GetRandomDrink:', err);
    return null;
  }
}

export async function GetDrinksBasic(lang: 'pl' | 'eng'): Promise<DrinkSimple[]> {
  try {
    const db = await getDb(lang);
    const rows: { id: number; name: string; img: string | null; range: string | null }[] =
      await db.getAllAsync('SELECT id, name, img, range FROM drinks ORDER BY name ASC');
    return rows.map(r => new DrinkSimple(r.id, r.name, r.img ?? '', r.range ?? ''));
  } catch (err) {
    console.error('Błąd przy GetDrinksBasic:', err);
    return [];
  }
}

export async function GetTopDrinks(
  taste: number[],         
  strength: number | null,  
  alcohols: number[],      
  ingredients: number[],   
  lang: "pl" | "eng"
): Promise<DrinkFull[]> {
  try {
    const db = await getDb(lang);

    const rows: {
      drink_id: number;
      strength_id: number | null;
      points_max: number; 
      alcohol_id: number | null;
      ingredient_id: number | null;
      taste_id: number | null;
    }[] = await db.getAllAsync(
      `
      SELECT 
        d.id as drink_id,
        d.strength_id,
        d.points_max,
        da.alcohol_id,
        di.ingredient_id,
        dt.taste_id
      FROM drinks d
      LEFT JOIN drinkAlcohol da ON da.drink_id = d.id
      LEFT JOIN drinkIngredients di ON di.drink_id = d.id
      LEFT JOIN drinkTaste dt ON dt.drink_id = d.id
      `
    );

    const grouped: Record<number, { strength_id: number | null; alcohols: number[]; ingredients: number[]; tastes: number[] }> = {};

    for (const row of rows) {
      if (!grouped[row.drink_id]) {
        grouped[row.drink_id] = {
          strength_id: row.strength_id,
          alcohols: [],
          ingredients: [],
          tastes: [],
        };
      }
      if (row.alcohol_id !== null && !grouped[row.drink_id].alcohols.includes(row.alcohol_id)) {
        grouped[row.drink_id].alcohols.push(row.alcohol_id);
      }
      if (row.ingredient_id !== null && !grouped[row.drink_id].ingredients.includes(row.ingredient_id)) {
        grouped[row.drink_id].ingredients.push(row.ingredient_id);
      }
      if (row.taste_id !== null && !grouped[row.drink_id].tastes.includes(row.taste_id)) {
        grouped[row.drink_id].tastes.push(row.taste_id);
      }
    }

    const maxPossiblePoints = 4 + (taste.length * 6) + (alcohols.length * 5);

    const scored = Object.entries(grouped)
      .map(([id, drink]) => {
   
        const hasExcludedIngredient = drink.ingredients.some(i => ingredients.includes(i));
        if (hasExcludedIngredient) {
          return null;
        }

        let points = 0;

        if (strength === 5 || drink.strength_id === strength) {
          points += 4;
        }

        for (const t of drink.tastes) {
          if (taste.includes(t)) points += 6;
        }

        for (const a of drink.alcohols) {
          if (alcohols.includes(a)) points += 5;
        }

        let percentage = Math.round((100 * points) / (maxPossiblePoints || 1));
        
        percentage = Math.min(percentage, 100);

        return { drink_id: Number(id), points, percentage };
      })
      .filter((d): d is { drink_id: number; points: number; percentage: number } => 
        d !== null && d.points > 0
      );

    const sortedScored = scored.sort((a, b) => b.percentage - a.percentage || b.points - a.points);

    const countOver70 = sortedScored.filter(d => d.percentage > 70).length;

    const limit = Math.max(5, countOver70);

    const top = sortedScored.slice(0, limit);

    const results: DrinkFull[] = [];
    for (const t of top) {
      const full = await GetDrinkById(t.drink_id, lang);
      if (full) {
        full.percentage = t.percentage; 
        results.push(full);
      }
    }

    return results;
  } catch (err) {
    console.error('Błąd przy GetTopDrinks:', err);
    return [];
  }
}

export async function MyIngredientsGetDrinks(
  selectedAlcohols: number[],
  selectedIngredients: number[],
  lang: 'pl' | 'eng'
): Promise<DrinkFull[]> {
  try {
    const db = await getDb(lang);

    const rows: {
      drink_id: number;
      strength_id: number | null;
      points_max: number;
      alcohol_id: number | null;
      ingredient_id: number | null;
    }[] = await db.getAllAsync(
      `
      SELECT 
        d.id as drink_id,
        d.strength_id,
        d.points_max,
        da.alcohol_id,
        di.ingredient_id
      FROM drinks d
      LEFT JOIN drinkAlcohol da ON da.drink_id = d.id
      LEFT JOIN drinkIngredients di ON di.drink_id = d.id
      `
    );

    const grouped: Record<number, { strength_id: number | null; points_max: number; alcohols: number[]; ingredients: number[] }> = {};

    for (const row of rows) {
      if (!grouped[row.drink_id]) {
        grouped[row.drink_id] = {
          strength_id: row.strength_id,
          points_max: row.points_max,
          alcohols: [],
          ingredients: [],
        };
      }
      if (row.alcohol_id !== null && !grouped[row.drink_id].alcohols.includes(row.alcohol_id)) {
        grouped[row.drink_id].alcohols.push(row.alcohol_id);
      }
      if (row.ingredient_id !== null && !grouped[row.drink_id].ingredients.includes(row.ingredient_id)) {
        grouped[row.drink_id].ingredients.push(row.ingredient_id);
      }
    }

    const scored = Object.entries(grouped).map(([id, drink]) => {
      const pointsAlcohol = drink.alcohols.filter(a => selectedAlcohols.includes(a)).length;
      const pointsIngredient = drink.ingredients.filter(i => selectedIngredients.includes(i)).length;
      const points = pointsAlcohol + pointsIngredient;
      const maxPoints = drink.alcohols.length + drink.ingredients.length;

      const percentage = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
      return { drink_id: Number(id), points, maxPoints, percentage };
    });

    const top = scored.filter(d => d.points > 0).sort((a, b) => b.percentage - a.percentage);

    const results: DrinkFull[] = [];
    for (const t of top) {
      const full = await GetDrinkById(t.drink_id, lang);
      if (full) {
        full.points = t.points;      
        full.maxPoints = t.maxPoints; 
        full.percentage = t.percentage;
        results.push(full);
      }
    }

    return results;
  } catch (err) {
    console.error('Błąd przy MyIngredientsGetDrinks:', err);
    return [];
  }
}
