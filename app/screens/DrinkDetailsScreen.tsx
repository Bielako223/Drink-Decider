import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { GetDrinkById } from '../DataManagment/DataAccess';
import DrinkItem from '../DrinkItem';
import { useTranslation } from 'react-i18next';
import { DrinkFull } from '../DataManagment/Classes';

// Typ parametrów dla tego ekranu
type DrinkDetailsRouteParams = {
  drinkId: number;
};

const DrinkDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: DrinkDetailsRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const drinkId = route.params?.drinkId;
  const [drink, setDrink] = useState<DrinkFull | null>(null);

  useEffect(() => {
    (async () => {
      const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
      if (drinkId !== undefined) {
        const data = await GetDrinkById(drinkId, lang);
        setDrink(data);
      }
    })();
  }, [drinkId, t]);

  if (!drink) return null;

  return <DrinkItem drink={drink} />;
};

export default DrinkDetailsScreen;
