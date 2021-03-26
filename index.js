import { readFileSync, writeFileSync } from 'fs';

let states = [];
let cities = [];

let listCitiesByState = [];

function createFiles() {
  try {
    states = JSON.parse(readFileSync("Estados.json"));
    cities = JSON.parse(readFileSync("Cidades.json"));

    states.map(state => {
      try {
        const citiesByUf = cities.filter(item => item.Estado === state.ID);
        writeFileSync(`${state.Sigla}.json`, JSON.stringify(citiesByUf, null, 2));
        listCitiesByState.push(citiesByUf);
      } catch (error) {
        throw new Error(`Falha ao gravar cidades: ${error}`);
      }
    });

  } catch (error) {
    throw new Error(`Falha: ${error}`);
  }
}

function countCitiesFromUF(uf) {
  const fileUF = JSON.parse(readFileSync(`${uf}.json`));
  const total = fileUF.length;
  return {
    uf,
    cidades: total
  }
}

function descCities() {
  const arrayCities = states.map(({ Sigla }) => countCitiesFromUF(Sigla));
  arrayCities.sort((a, b) => b.cidades - a.cidades);
  console.log("Ordem decrescente - Mais cidades");
  arrayCities.filter((_, index) => index < 5)
    .map(({ uf, cidades }) => console.log(`${uf} - ${cidades}`));
};

function ascCities() {
  const arrayCities = states.map(({ Sigla }) => countCitiesFromUF(Sigla));
  arrayCities.sort((a, b) => b.cidades - a.cidades);
  console.log("Ordem decrescente - Menos cidades");
  arrayCities.filter((_, index) => index > arrayCities.length - 6)
    .map(({ uf, cidades }) => console.log(`${uf} - ${cidades}`));
};

function nameDescCities() {
  states.map(({ Sigla }) => {
    const fileUF = JSON.parse(readFileSync(`${Sigla}.json`));
    fileUF.sort((a, b) => b.Nome.length - a.Nome.length);
    fileUF.filter((_, index) => index < 1).map(({ Nome }) =>
      console.log(`${Nome} - ${Sigla}`));
  });
}

function nameAscCities() {
  states.map(({ Sigla }) => {
    const fileUF = JSON.parse(readFileSync(`${Sigla}.json`));
    fileUF.sort((a, b) => a.Nome.length - b.Nome.length);
    fileUF.filter((_, index) => index < 1).map(({ Nome }) => console.log(`${Nome} - ${Sigla}`));
  });
}

function nameUp() {
  let data = []
  states.map(({ Sigla }) => {
    const fileUF = JSON.parse(readFileSync(`${Sigla}.json`));
    fileUF.sort((a, b) => b.Nome.length - a.Nome.length);
    fileUF.filter((_, index) => index < 1).map(({ Nome }) => {
      data.push({
        Nome,
        Sigla
      });
    });
  });

  data.sort((a, b) => {
    const size = b.Nome.length - a.Nome.length;
    const alph = b.Nome.localeCompare(a.Nome);
    return size || alph
  });

  data.filter((_, index) => index < 1)
    .map(({ Nome, Sigla }) => console.log(`${Nome} - ${Sigla}`));
}

function nameDown() {
  let data = []
  states.map(({ Sigla }) => {
    const fileUF = JSON.parse(readFileSync(`${Sigla}.json`));
    fileUF.sort((a, b) => a.Nome.length - b.Nome.length);
    fileUF.filter((_, index) => index < 1).map(({ Nome }) => {
      data.push({
        Nome,
        Sigla
      });
    });
  });
  data.sort((a, b) => {
    const size = a.Nome.length - b.Nome.length;
    const alph = a.Nome.localeCompare(b.Nome);
    return size || alph
  });
  data.filter((_, index) => index < 1)
    .map(({ Nome, Sigla }) => console.log(`${Nome} - ${Sigla}`));
}

createFiles();
countCitiesFromUF("MS");
descCities();
ascCities();
nameDescCities();
nameAscCities();
nameUp();
nameDown();

