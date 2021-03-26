import { readFileSync, writeFileSync } from 'fs';

let states = [];
let cities = [];

function createFiles() {
  try {
    states = JSON.parse(readFileSync("Estados.json"));
    cities = JSON.parse(readFileSync("Cidades.json"));

    try {
      states.map(state => {
        const citiesByUf = cities.filter(city => city.Estado === state.ID);
        writeFileSync(`${state.Sigla}.json`, JSON.stringify(citiesByUf, null, 2));
      });
    } catch (error) {
      throw new Error(`Falha: ${error}`);
    }

  } catch (error) {
    throw new Error(`Falha: ${error}`);
  }
}

function countCitiesFromUF(uf) {
  const total = JSON.parse(readFileSync(`${uf}.json`)).length;
  return {
    uf,
    countCity: total
  }
}

function orderByQtd() {
  const arrayCities = states.map(({ Sigla }) => countCitiesFromUF(Sigla));
  arrayCities.sort((a, b) => b.countCity - a.countCity);
  return arrayCities;
}

function getCitiesWithMoreCitiesDesc() {
  return orderByQtd().slice(0, 5);
};

function getCitiesWithLessCitiesDesc() {
  return orderByQtd().slice(-5);
};

const TYPE_ORDER = {
  ASC: 1,
  DESC: 2
}

function orderByName(typeOrder) {
  const ordenedCities = states.map(state => {
    const arrayCities = cities.filter(city => city.Estado === state.ID);
    let city = null;
    if (typeOrder === TYPE_ORDER.DESC) {
      city = arrayCities.sort((a, b) => b.Nome.length - a.Nome.length)[0];
    } else {
      city = arrayCities.sort((a, b) => a.Nome.length - b.Nome.length)[0];
    }
    return {
      nome: city.Nome,
      uf: state.Sigla
    }
  });
  return ordenedCities;
}

function getBiggerOrSmallName(typeOrder) {
  const city = orderByName(typeOrder);
  if (typeOrder === TYPE_ORDER.DESC) {
    city.sort((a, b) => {
      const size = b.nome.length - a.nome.length;
      const alph = b.nome.localeCompare(a.nome);
      return size || alph;
    });
  } else {
    city.sort((a, b) => {
      const size = a.nome.length - b.nome.length;
      const alph = a.nome.localeCompare(b.nome);
      return size || alph;
    });
  }
  return city[0];
}

function init() {
  // 1 
  createFiles();
  // 2
  const { uf, countCity } = countCitiesFromUF("MS");
  console.log(`Estado: ${uf}, possui ${countCity} cidade(s)`);
  // 3
  console.log("5 Estados com maior número de cidades - Ordem decrescente");
  getCitiesWithMoreCitiesDesc().map(({ uf, countCity }) => console.log(`${uf} - ${countCity}`));
  // 4
  console.log("5 Estados com menor número de cidades - Ordem decrescente");
  getCitiesWithLessCitiesDesc().map(({ uf, countCity }) => console.log(`${uf} - ${countCity}`));
  // 5 
  console.log("Cidade de maior nome - Cada estado");
  orderByName(TYPE_ORDER.DESC).map(({ nome, uf }) => console.log(`${nome} - ${uf}`));
  // 6
  console.log("Cidade de menor nome - Cada estado");
  orderByName(TYPE_ORDER.ASC).map(({ nome, uf }) => console.log(`${nome} - ${uf}`));
  // 7
  console.log("Cidade de maior nome - Todos estados");
  let city = getBiggerOrSmallName(TYPE_ORDER.DESC);
  console.log(`${city.nome} - ${city.uf}`);
  // 8
  console.log("Cidade de menor nome - Todos estados");
  city = getBiggerOrSmallName(TYPE_ORDER.ASC);
  console.log(`${city.nome} - ${city.uf}`);
}

init();