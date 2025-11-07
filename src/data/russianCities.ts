export interface CityData {
  id: string;
  name: string;
  region: string;
  population: number;
  lat: number;
  lon: number;
  description: string;
  founded: number;
  area: number;
  timezone: string;
  elevation: number;
  isCapital?: boolean;
  isMajor?: boolean;
}

export const russianCities: CityData[] = [
  {
    id: 'moscow',
    name: 'Москва',
    region: 'Москва',
    population: 13010112,
    lat: 55.7558,
    lon: 37.6173,
    description: 'Столица России, крупнейший город страны, политический, экономический и культурный центр.',
    founded: 1147,
    area: 2561,
    timezone: 'Europe/Moscow',
    elevation: 156,
    isCapital: true,
    isMajor: true
  },
  {
    id: 'saint-petersburg',
    name: 'Санкт-Петербург',
    region: 'Санкт-Петербург',
    population: 5601911,
    lat: 59.9311,
    lon: 30.3609,
    description: 'Культурная столица России, город федерального значения, крупнейший порт на Балтийском море.',
    founded: 1703,
    area: 1439,
    timezone: 'Europe/Moscow',
    elevation: 3,
    isMajor: true
  },
  {
    id: 'novosibirsk',
    name: 'Новосибирск',
    region: 'Новосибирская область',
    population: 1633595,
    lat: 55.0084,
    lon: 82.9357,
    description: 'Третий по численности город России, крупнейший научный и культурный центр Сибири.',
    founded: 1893,
    area: 502,
    timezone: 'Asia/Novosibirsk',
    elevation: 164,
    isMajor: true
  },
  {
    id: 'yekaterinburg',
    name: 'Екатеринбург',
    region: 'Свердловская область',
    population: 1544376,
    lat: 56.8389,
    lon: 60.6057,
    description: 'Четвертый по численности город России, административный центр Урала.',
    founded: 1723,
    area: 468,
    timezone: 'Asia/Yekaterinburg',
    elevation: 237,
    isMajor: true
  },
  {
    id: 'kazan',
    name: 'Казань',
    region: 'Республика Татарстан',
    population: 1308660,
    lat: 55.8304,
    lon: 49.0661,
    description: 'Столица Республики Татарстан, спортивная столица России.',
    founded: 1005,
    area: 425,
    timezone: 'Europe/Moscow',
    elevation: 61,
    isMajor: true
  },
  {
    id: 'nizhny-novgorod',
    name: 'Нижний Новгород',
    region: 'Нижегородская область',
    population: 1228199,
    lat: 56.2965,
    lon: 43.9361,
    description: 'Административный центр Приволжского федерального округа, крупный промышленный центр.',
    founded: 1221,
    area: 466,
    timezone: 'Europe/Moscow',
    elevation: 141,
    isMajor: true
  },
  {
    id: 'chelyabinsk',
    name: 'Челябинск',
    region: 'Челябинская область',
    population: 1189525,
    lat: 55.1644,
    lon: 61.4368,
    description: 'Крупный промышленный центр Урала, город металлургии и машиностроения.',
    founded: 1736,
    area: 530,
    timezone: 'Asia/Yekaterinburg',
    elevation: 219,
    isMajor: true
  },
  {
    id: 'samara',
    name: 'Самара',
    region: 'Самарская область',
    population: 1173299,
    lat: 53.2001,
    lon: 50.15,
    description: 'Крупный центр авиа- и ракетостроения, город на Волге.',
    founded: 1586,
    area: 541,
    timezone: 'Europe/Samara',
    elevation: 117,
    isMajor: true
  },
  {
    id: 'omsk',
    name: 'Омск',
    region: 'Омская область',
    population: 1125695,
    lat: 54.9885,
    lon: 73.3242,
    description: 'Крупный транспортный узел, промышленный и культурный центр Западной Сибири.',
    founded: 1716,
    area: 566,
    timezone: 'Asia/Omsk',
    elevation: 90,
    isMajor: true
  },
  {
    id: 'rostov-on-don',
    name: 'Ростов-на-Дону',
    region: 'Ростовская область',
    population: 1142162,
    lat: 47.2357,
    lon: 39.7015,
    description: 'Южная столица России, крупный порт на Азовском море.',
    founded: 1749,
    area: 348,
    timezone: 'Europe/Moscow',
    elevation: 74,
    isMajor: true
  },
  {
    id: 'ufa',
    name: 'Уфа',
    region: 'Республика Башкортостан',
    population: 1156598,
    lat: 54.7388,
    lon: 55.9721,
    description: 'Столица Республики Башкортостан, крупный нефтеперерабатывающий центр.',
    founded: 1574,
    area: 707,
    timezone: 'Asia/Yekaterinburg',
    elevation: 150,
    isMajor: true
  },
  {
    id: 'krasnoyarsk',
    name: 'Красноярск',
    region: 'Красноярский край',
    population: 1187771,
    lat: 56.0153,
    lon: 92.8932,
    description: 'Крупнейший деловой, промышленный и культурный центр Восточной Сибири.',
    founded: 1628,
    area: 353,
    timezone: 'Asia/Krasnoyarsk',
    elevation: 287,
    isMajor: true
  },
  {
    id: 'voronezh',
    name: 'Воронеж',
    region: 'Воронежская область',
    population: 1058261,
    lat: 51.6605,
    lon: 39.2005,
    description: 'Крупный промышленный и культурный центр Центрального Черноземья.',
    founded: 1586,
    area: 596,
    timezone: 'Europe/Moscow',
    elevation: 154,
    isMajor: true
  },
  {
    id: 'perm',
    name: 'Пермь',
    region: 'Пермский край',
    population: 1055397,
    lat: 58.0105,
    lon: 56.2502,
    description: 'Крупный центр Урала, город на реке Кама.',
    founded: 1723,
    area: 799,
    timezone: 'Asia/Yekaterinburg',
    elevation: 171,
    isMajor: true
  },
  {
    id: 'volgograd',
    name: 'Волгоград',
    region: 'Волгоградская область',
    population: 1028036,
    lat: 48.7080,
    lon: 44.5133,
    description: 'Город-герой, крупный промышленный и транспортный центр на Волге.',
    founded: 1589,
    area: 859,
    timezone: 'Europe/Volgograd',
    elevation: 65,
    isMajor: true
  },
  {
    id: 'krasnodar',
    name: 'Краснодар',
    region: 'Краснодарский край',
    population: 1099344,
    lat: 45.0355,
    lon: 38.9753,
    description: 'Столица Кубани, крупный экономический и культурный центр Юга России.',
    founded: 1793,
    area: 339,
    timezone: 'Europe/Moscow',
    elevation: 28,
    isMajor: true
  },
  {
    id: 'saratov',
    name: 'Саратов',
    region: 'Саратовская область',
    population: 901361,
    lat: 51.5924,
    lon: 46.0348,
    description: 'Крупный порт на Волге, промышленный и культурный центр Поволжья.',
    founded: 1590,
    area: 394,
    timezone: 'Europe/Saratov',
    elevation: 50,
    isMajor: true
  },
  {
    id: 'tyumen',
    name: 'Тюмень',
    region: 'Тюменская область',
    population: 816700,
    lat: 57.1522,
    lon: 65.5272,
    description: 'Первый русский город в Сибири, нефтегазовая столица России.',
    founded: 1586,
    area: 698,
    timezone: 'Asia/Yekaterinburg',
    elevation: 65,
    isMajor: true
  },
  {
    id: 'tolyatti',
    name: 'Тольятти',
    region: 'Самарская область',
    population: 693900,
    lat: 53.5303,
    lon: 49.3461,
    description: 'Автомобильная столица России, город АВТОВАЗа.',
    founded: 1737,
    area: 315,
    timezone: 'Europe/Samara',
    elevation: 82
  },
  {
    id: 'izhevsk',
    name: 'Ижевск',
    region: 'Удмуртская Республика',
    population: 648146,
    lat: 56.8519,
    lon: 53.2048,
    description: 'Столица Удмуртии, центр оружейного производства России.',
    founded: 1760,
    area: 315,
    timezone: 'Europe/Samara',
    elevation: 145
  },
  {
    id: 'barnaul',
    name: 'Барнаул',
    region: 'Алтайский край',
    population: 630877,
    lat: 53.3606,
    lon: 83.7636,
    description: 'Столица Алтайского края, город на реке Обь.',
    founded: 1730,
    area: 321,
    timezone: 'Asia/Barnaul',
    elevation: 185
  },
  {
    id: 'ulyanovsk',
    name: 'Ульяновск',
    region: 'Ульяновская область',
    population: 627705,
    lat: 54.3142,
    lon: 48.4031,
    description: 'Родина В.И. Ленина, крупный промышленный центр на Волге.',
    founded: 1648,
    area: 316,
    timezone: 'Europe/Ulyanovsk',
    elevation: 135
  },
  {
    id: 'irkutsk',
    name: 'Иркутск',
    region: 'Иркутская область',
    population: 623869,
    lat: 52.2978,
    lon: 104.2964,
    description: 'Столица Восточной Сибири, ворота к Байкалу.',
    founded: 1661,
    area: 277,
    timezone: 'Asia/Irkutsk',
    elevation: 467
  },
  {
    id: 'khabarovsk',
    name: 'Хабаровск',
    region: 'Хабаровский край',
    population: 617473,
    lat: 48.4827,
    lon: 135.0838,
    description: 'Столица Дальнего Востока, город на Амуре.',
    founded: 1858,
    area: 386,
    timezone: 'Asia/Vladivostok',
    elevation: 72
  },
  {
    id: 'yaroslavl',
    name: 'Ярославль',
    region: 'Ярославская область',
    population: 608353,
    lat: 57.6261,
    lon: 39.8845,
    description: 'Древний город Золотого кольца России, на Волге.',
    founded: 1010,
    area: 205,
    timezone: 'Europe/Moscow',
    elevation: 98
  },
  {
    id: 'vladivostok',
    name: 'Владивосток',
    region: 'Приморский край',
    population: 603519,
    lat: 43.1056,
    lon: 131.8735,
    description: 'Морские ворота России на Тихом океане, конечная точка Транссиба.',
    founded: 1860,
    area: 331,
    timezone: 'Asia/Vladivostok',
    elevation: 42
  },
  {
    id: 'makhachkala',
    name: 'Махачкала',
    region: 'Республика Дагестан',
    population: 623254,
    lat: 42.9849,
    lon: 47.5047,
    description: 'Столица Дагестана, крупнейший город на Каспийском море.',
    founded: 1844,
    area: 468,
    timezone: 'Europe/Moscow',
    elevation: -28
  },
  {
    id: 'tomsk',
    name: 'Томск',
    region: 'Томская область',
    population: 575352,
    lat: 56.4977,
    lon: 84.9744,
    description: 'Крупнейший образовательный и научный центр Сибири.',
    founded: 1604,
    area: 294,
    timezone: 'Asia/Tomsk',
    elevation: 117
  },
  {
    id: 'orenburg',
    name: 'Оренбург',
    region: 'Оренбургская область',
    population: 572188,
    lat: 51.7727,
    lon: 55.0988,
    description: 'Город на границе Европы и Азии, на реке Урал.',
    founded: 1743,
    area: 300,
    timezone: 'Asia/Yekaterinburg',
    elevation: 154
  },
  {
    id: 'kemerovo',
    name: 'Кемерово',
    region: 'Кемеровская область',
    population: 556382,
    lat: 55.3333,
    lon: 86.0833,
    description: 'Столица Кузбасса, центр угледобычи России.',
    founded: 1918,
    area: 282,
    timezone: 'Asia/Novokuznetsk',
    elevation: 150
  },
  {
    id: 'novokuznetsk',
    name: 'Новокузнецк',
    region: 'Кемеровская область',
    population: 537480,
    lat: 53.7557,
    lon: 87.1099,
    description: 'Крупнейший металлургический центр Западной Сибири.',
    founded: 1618,
    area: 424,
    timezone: 'Asia/Novokuznetsk',
    elevation: 264
  },
  {
    id: 'ryazan',
    name: 'Рязань',
    region: 'Рязанская область',
    population: 534762,
    lat: 54.6269,
    lon: 39.6916,
    description: 'Древний город в центре России, на Оке.',
    founded: 1095,
    area: 224,
    timezone: 'Europe/Moscow',
    elevation: 130
  },
  {
    id: 'astrakhan',
    name: 'Астрахань',
    region: 'Астраханская область',
    population: 524371,
    lat: 46.3497,
    lon: 48.0408,
    description: 'Южный город России, столица Нижнего Поволжья.',
    founded: 1558,
    area: 209,
    timezone: 'Europe/Astrakhan',
    elevation: -22
  },
  {
    id: 'naberezhnye-chelny',
    name: 'Набережные Челны',
    region: 'Республика Татарстан',
    population: 533839,
    lat: 55.7430,
    lon: 52.3954,
    description: 'Город КАМАЗа, крупный промышленный центр Татарстана.',
    founded: 1626,
    area: 171,
    timezone: 'Europe/Moscow',
    elevation: 67
  },
  {
    id: 'penza',
    name: 'Пенза',
    region: 'Пензенская область',
    population: 511602,
    lat: 53.2007,
    lon: 45.0046,
    description: 'Город в центре России, крупный промышленный центр.',
    founded: 1663,
    area: 305,
    timezone: 'Europe/Moscow',
    elevation: 174
  },
  {
    id: 'lipetsk',
    name: 'Липецк',
    region: 'Липецкая область',
    population: 503384,
    lat: 52.6031,
    lon: 39.5708,
    description: 'Крупный центр металлургии и машиностроения.',
    founded: 1703,
    area: 320,
    timezone: 'Europe/Moscow',
    elevation: 160
  },
  {
    id: 'kirov',
    name: 'Киров',
    region: 'Кировская область',
    population: 532080,
    lat: 58.6035,
    lon: 49.6679,
    description: 'Город на реке Вятка, промышленный центр Урала.',
    founded: 1374,
    area: 170,
    timezone: 'Europe/Kirov',
    elevation: 134
  },
  {
    id: 'cheboksary',
    name: 'Чебоксары',
    region: 'Чувашская Республика',
    population: 495746,
    lat: 56.1439,
    lon: 47.2489,
    description: 'Столица Чувашии, город на Волге.',
    founded: 1469,
    area: 233,
    timezone: 'Europe/Moscow',
    elevation: 127
  },
  {
    id: 'kaliningrad',
    name: 'Калининград',
    region: 'Калининградская область',
    population: 489359,
    lat: 54.7104,
    lon: 20.4522,
    description: 'Самый западный город России, бывший Кёнигсберг.',
    founded: 1255,
    area: 215,
    timezone: 'Europe/Kaliningrad',
    elevation: 20
  },
  {
    id: 'tula',
    name: 'Тула',
    region: 'Тульская область',
    population: 475161,
    lat: 54.1961,
    lon: 37.6182,
    description: 'Город оружейников и пряников, центр Центральной России.',
    founded: 1146,
    area: 146,
    timezone: 'Europe/Moscow',
    elevation: 182
  },
  {
    id: 'sochi',
    name: 'Сочи',
    region: 'Краснодарский край',
    population: 466078,
    lat: 43.6028,
    lon: 39.7342,
    description: 'Летняя и зимняя столица России, курортный город на Черном море.',
    founded: 1838,
    area: 3502,
    timezone: 'Europe/Moscow',
    elevation: 65
  }
];

export const getCityById = (id: string): CityData | undefined => {
  return russianCities.find(city => city.id === id);
};

export const getCitiesByRegion = (region: string): CityData[] => {
  return russianCities.filter(city => city.region === region);
};

export const getMajorCities = (): CityData[] => {
  return russianCities.filter(city => city.isMajor);
};

export const searchCities = (query: string): CityData[] => {
  const lowerQuery = query.toLowerCase();
  return russianCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.region.toLowerCase().includes(lowerQuery)
  );
};
