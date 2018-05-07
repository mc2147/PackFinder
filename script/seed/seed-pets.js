const faker = require('faker');
const chance = require('chance')(1232)
// const toonAvatar = require('cartoon-avatar');
const Promise = require('bluebird');
const db = require('../../server/db');
const {
  Pet
} = require('../../server/db/models');
const axios = require('axios');

const numPets = 30;

const breeds = {
  "affenpinscher": [],
  "african": [],
  "airedale": [],
  "akita": [],
  "appenzeller": [],
  "basenji": [],
  "beagle": [],
  "bluetick": [],
  "borzoi": [],
  "bouvier": [],
  "boxer": [],
  "brabancon": [],
  "briard": [],
  "bulldog": [
    "boston",
    "french"
  ],
  "bullterrier": [
    "staffordshire"
  ],
  "cairn": [],
  "chihuahua": [],
  "chow": [],
  "clumber": [],
  "collie": [
    "border"
  ],
  "coonhound": [],
  "corgi": [
    "cardigan"
  ],
  "dachshund": [],
  "dalmatian": [],
  "dane": [
    "great"
  ],
  "deerhound": [
    "scottish"
  ],
  "dhole": [],
  "dingo": [],
  "doberman": [],
  "elkhound": [
    "norwegian"
  ],
  "entlebucher": [],
  "eskimo": [],
  "germanshepherd": [],
  "greyhound": [
    "italian"
  ],
  "groenendael": [],
  "hound": [
    "afghan",
    "basset",
    "blood",
    "english",
    "ibizan",
    "walker"
  ],
  "husky": [],
  "keeshond": [],
  "kelpie": [],
  "komondor": [],
  "kuvasz": [],
  "labrador": [],
  "leonberg": [],
  "lhasa": [],
  "malamute": [],
  "malinois": [],
  "maltese": [],
  "mastiff": [
    "bull",
    "tibetan"
  ],
  "mexicanhairless": [],
  "mix": [],
  "mountain": [
    "bernese",
    "swiss"
  ],
  "newfoundland": [],
  "otterhound": [],
  "papillon": [],
  "pekinese": [],
  "pembroke": [],
  "pinscher": [
    "miniature"
  ],
  "pointer": [
    "german"
  ],
  "pomeranian": [],
  "poodle": [
    "miniature",
    "standard",
    "toy"
  ],
  "pug": [],
  "pyrenees": [],
  "redbone": [],
  "retriever": [
    "chesapeake",
    "curly",
    "flatcoated",
    "golden"
  ],
  "ridgeback": [
    "rhodesian"
  ],
  "rottweiler": [],
  "saluki": [],
  "samoyed": [],
  "schipperke": [],
  "schnauzer": [
    "giant",
    "miniature"
  ],
  "setter": [
    "english",
    "gordon",
    "irish"
  ],
  "sheepdog": [
    "english",
    "shetland"
  ],
  "shiba": [],
  "shihtzu": [],
  "spaniel": [
    "blenheim",
    "brittany",
    "cocker",
    "irish",
    "japanese",
    "sussex",
    "welsh"
  ],
  "springer": [
    "english"
  ],
  "stbernard": [],
  "terrier": [
    "american",
    "australian",
    "bedlington",
    "border",
    "dandie",
    "fox",
    "irish",
    "kerryblue",
    "lakeland",
    "norfolk",
    "norwich",
    "patterdale",
    "scottish",
    "sealyham",
    "silky",
    "tibetan",
    "toy",
    "westhighland",
    "wheaten",
    "yorkshire"
  ],
  "vizsla": [],
  "weimaraner": [],
  "whippet": [],
  "wolfhound": [
    "irish"
  ]
}

let breedArray = Object.keys(breeds)

function doTimes(n, fn) {
  const results = [];
  while (n--) {
    results.push(fn());
  }
  return results;
}

async function randPet() {
  let randBreed = chance.pickone(breedArray)
  let subBreed = ''
  if (breeds[randBreed].length > 1) {
    subBreed = `${breeds[randBreed][chance.integer({
      min: 0,
      max: breeds[randBreed].length - 1
    })]}`
  }
  if (breeds[randBreed].length === 1) subBreed = `${breeds[randBreed][0]}`
  let urlBreed = randBreed
  if (subBreed) {
    urlBreed = `${randBreed}/${subBreed}`
    subBreed = `${subBreed} `
  }
  let imageUrl = 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_2374.jpg'
  await axios.get(`https://dog.ceo/api/breed/${urlBreed}/images/random`)
    .then(res => {
      imageUrl = res.data.message
    })
  const pet = {
    name: faker.name.firstName(),
    age: chance.integer({
      min: 1,
      max: 16
    }),
    breed: `${subBreed}${randBreed}`,
    imageUrls: [imageUrl],
    bio: chance.paragraph({
      sentences: 1
    }),
    weight: chance.integer({
      min: 7,
      max: 125
    }),
    userId: chance.integer({
      min: 1,
      max: 19
    })
  };

  return Pet.build(pet);
}

function generatePets() {
  const pets = doTimes(numPets, randPet);

  //PUT CUSTOM PETS HERE

  // pets.push(
  //   Pet.build({
  //     age: chance.integer({
  //       min: 1,
  //       max: 16
  //     }),
  //     breed: `${subBreed}${randBreed}`,
  //     imageUrls: [imageUrl],
  //     bio: chance.paragraph({
  //       sentences: 1
  //     }),
  //     weight: chance.integer({
  //       min: 7,
  //       max: 125
  //     }),
  //     userId: chance.integer({
  //       min: 1,
  //       max: 19
  //     })
  //   }))
  return pets;
}

function createPets() {
  return Promise.map(generatePets(), pets => pets.save());
}

function seed() {
  console.log('Syncing pets');
  return createPets();
}

module.exports = seed

