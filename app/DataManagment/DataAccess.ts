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

// ============================================================================
// OPTYMALIZACJA: Funkcja pomocnicza rozwiązująca problem N+1 oraz kartezjański
// Pobiera pełne dane o drinkach (alkohole, składniki, smaki) w zaledwie 4 zapytaniach.
// ============================================================================
async function GetFullDrinksByIds(drinkIds: number[], lang: 'pl' | 'eng'): Promise<DrinkFull[]> {
  if (!drinkIds || drinkIds.length === 0) return [];
  
  try {
    const db = await getDb(lang);
    // Zabezpieczenie parametrów dla klauzuli IN (?, ?, ?)
    const placeholders = drinkIds.map(() => '?').join(',');

    // Równoległe pobranie wszystkich potrzebnych danych - mega przyspieszenie
    const [drinksData, alcoholsData, ingredientsData, tastesData] = await Promise.all([
      db.getAllAsync(`
        SELECT d.id, d.name, d.description, d.img, d.points_max, d.range,
               s.id as strength_id, s.name as strength_name
        FROM drinks d
        LEFT JOIN strength s ON d.strength_id = s.id
        WHERE d.id IN (${placeholders})
      `, drinkIds),
      
      db.getAllAsync(`
        SELECT da.drink_id, a.id, a.name, a.description
        FROM drinkAlcohol da
        JOIN alcohol a ON da.alcohol_id = a.id
        WHERE da.drink_id IN (${placeholders})
      `, drinkIds),

      db.getAllAsync(`
        SELECT di.drink_id, i.id, i.name, i.description
        FROM drinkIngredients di
        JOIN ingredients i ON di.ingredient_id = i.id
        WHERE di.drink_id IN (${placeholders})
      `, drinkIds),

      db.getAllAsync(`
        SELECT dt.drink_id, t.id, t.name
        FROM drinkTaste dt
        JOIN taste t ON dt.taste_id = t.id
        WHERE dt.drink_id IN (${placeholders})
      `, drinkIds)
    ]);

    // Składanie obiektów w JavaScript (nieporównywalnie szybsze niż mielenie zduplikowanych JOINów z SQL)
    const drinksMap: Record<number, DrinkFull> = {};

    for (const d of (drinksData as any[])) {
      drinksMap[d.id] = new DrinkFull(
        d.id, d.name, d.description ?? '', d.img ?? '', d.points_max, d.range ?? '',
        d.strength_id ? new BaseItem(d.strength_id, d.strength_name ?? '') : null,
        [], [], []
      );
    }

    for (const a of (alcoholsData as any[])) {
      if (drinksMap[a.drink_id]) {
        drinksMap[a.drink_id].alcohols.push(new BaseItem(a.id, a.name, a.description));
      }
    }

    for (const i of (ingredientsData as any[])) {
      if (drinksMap[i.drink_id]) {
        drinksMap[i.drink_id].ingredients.push(new BaseItem(i.id, i.name, i.description));
      }
    }

    for (const t of (tastesData as any[])) {
      if (drinksMap[t.drink_id]) {
        drinksMap[t.drink_id].tastes.push(new BaseItem(t.id, t.name));
      }
    }

    // Zwracamy jako płaską tablicę
    return Object.values(drinksMap);

  } catch (err) {
    console.error('Błąd przy GetFullDrinksByIds:', err);
    return [];
  }
}

// Teraz GetDrinkById jest zwięzłe i korzysta ze zoptymalizowanego mechanizmu
export async function GetDrinkById(drinkId: number, lang: 'pl' | 'eng'): Promise<DrinkFull | null> {
  const drinks = await GetFullDrinksByIds([drinkId], lang);
  return drinks.length > 0 ? drinks[0] : null;
}

export async function GetDrinkDetails(drinkId: number, lang: 'pl' | 'eng'): Promise<DrinkDetails | null> {
  try {
    const db = await getDb(lang);
    
    // OPTYMALIZACJA: Pobieranie instrukcji i przygotowania równolegle
    // Usuwamy <{...}> z wywołania funkcji, a typujemy same wyniki
    const [instructionRowsData, prepIngredientRowsData] = await Promise.all([
      db.getAllAsync(
        'SELECT id, step_number, instruction FROM drinkInstructions WHERE drink_id = ? ORDER BY step_number ASC', [drinkId]
      ),
      db.getAllAsync(
        'SELECT id, ingredient_text FROM drinkPrepIngredients WHERE drink_id = ?', [drinkId]
      )
    ]);

    // Rzutowanie wyników na odpowiednie typy (as Type[])
    const instructionRows = instructionRowsData as { id: number; step_number: number; instruction: string }[];
    const prepIngredientRows = prepIngredientRowsData as { id: number; ingredient_text: string }[];

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
    // OPTYMALIZACJA: Losowanie po stronie bazy SQLite (ORDER BY RANDOM())
    const row: { id: number }[] = await db.getAllAsync('SELECT id FROM drinks ORDER BY RANDOM() LIMIT 1');
    if (!row || row.length === 0) return null;
    return await GetDrinkById(row[0].id, lang);
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
      alcohol_id: number | null;
      ingredient_id: number | null;
      taste_id: number | null;
    }[] = await db.getAllAsync(`
      SELECT d.id as drink_id, d.strength_id, da.alcohol_id, di.ingredient_id, dt.taste_id
      FROM drinks d
      LEFT JOIN drinkAlcohol da ON da.drink_id = d.id
      LEFT JOIN drinkIngredients di ON di.drink_id = d.id
      LEFT JOIN drinkTaste dt ON dt.drink_id = d.id
    `);

    const grouped: Record<number, { strength_id: number | null; alcohols: number[]; ingredients: number[]; tastes: number[] }> = {};

    for (const row of rows) {
      if (!grouped[row.drink_id]) {
        grouped[row.drink_id] = { strength_id: row.strength_id, alcohols: [], ingredients: [], tastes: [] };
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

    const scored = Object.entries(grouped)
      .map(([id, drink]) => {
        // Wykluczanie
        const hasExcludedIngredient = drink.ingredients.some(i => ingredients.includes(i));
        if (hasExcludedIngredient) return null;

        let points = 0;
        // Moc (max 5 pkt)
        if (strength === 5 || drink.strength_id === strength) points += 5;

        // Smaki (6 pkt za każdy pasujący)
        for (const t of drink.tastes) {
          if (taste.includes(t)) points += 6;
        }

        // Alkohole (4 pkt bonusu, niewliczane do maxPoints)
        for (const a of drink.alcohols) {
          if (alcohols.includes(a)) points += 4;
        }

        // Wzór: 5 (za moc) + 6 * ilość smaków
        const drinkMaxPoints = 5 + (drink.tastes.length * 6);

        // OPTYMALIZACJA LOGIKI: Zapisujemy surowy procent do sortowania (np. 120%), 
        // ale oddzielnie przygotowujemy ładny procent do widoku (max 100%)
        let rawPercentage = Math.round((100 * points) / (drinkMaxPoints || 1));
        let displayPercentage = rawPercentage > 100 ? 100 : rawPercentage;

        return { drink_id: Number(id), points, rawPercentage, displayPercentage };
      })
      .filter((d): d is { drink_id: number; points: number; rawPercentage: number; displayPercentage: number } => 
        d !== null && d.points > 0
      );

    // Sortujemy po surowym procencie, dzięki czemu drink mający np. 120% ląduje wyżej niż ten mający 100%
    const sortedScored = scored.sort((a, b) => b.rawPercentage - a.rawPercentage || b.points - a.points);

    const countOver70 = sortedScored.filter(d => d.rawPercentage > 70).length;
    const limit = Math.max(5, countOver70);
    const top = sortedScored.slice(0, limit);

    if (top.length === 0) return [];

    // OPTYMALIZACJA N+1: Pobieramy pełne dane o wszystkich wygranych drinkach w JEDNYM uderzeniu do bazy!
    const topIds = top.map(t => t.drink_id);
    const fullDrinks = await GetFullDrinksByIds(topIds, lang);

    // Łączymy wyniki i nadajemy im wyliczony displayPercentage
    const results: DrinkFull[] = [];
    for (const t of top) {
      const full = fullDrinks.find(f => f.id === t.drink_id);
      if (full) {
        full.percentage = t.displayPercentage; // Widzimy max 100%
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
    }[] = await db.getAllAsync(`
      SELECT d.id as drink_id, d.strength_id, d.points_max, da.alcohol_id, di.ingredient_id
      FROM drinks d
      LEFT JOIN drinkAlcohol da ON da.drink_id = d.id
      LEFT JOIN drinkIngredients di ON di.drink_id = d.id
    `);

    const grouped: Record<number, { strength_id: number | null; points_max: number; alcohols: number[]; ingredients: number[] }> = {};

    for (const row of rows) {
      if (!grouped[row.drink_id]) {
        grouped[row.drink_id] = { strength_id: row.strength_id, points_max: row.points_max, alcohols: [], ingredients: [] };
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

    if (top.length === 0) return [];

    // OPTYMALIZACJA N+1: Używamy tego samego mechanizmu co przy TopDrinks
    const topIds = top.map(t => t.drink_id);
    const fullDrinks = await GetFullDrinksByIds(topIds, lang);

    const results: DrinkFull[] = [];
    for (const t of top) {
      const full = fullDrinks.find(f => f.id === t.drink_id);
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