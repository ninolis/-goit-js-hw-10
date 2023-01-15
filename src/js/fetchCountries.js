function fetchCountries(name, filter) {
  const { officialName, capital, population, flag, languages } = filter;
  return fetch(
    `https://restcountries.com/v3.1/name/${name}/?fields=${officialName},${capital},${population},${flag},${languages}`
  );
}

export { fetchCountries };
