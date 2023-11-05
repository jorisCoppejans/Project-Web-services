let USER_DATA = [
  {
    id : 1,
    firstName: 'Joris',
    lastName: 'Coppejans',
    email: 'joris.coppejans@yahoo.com',
    password: 'abcd1234'
  },
  {
    id : 2,
    firstName: 'Stef',
    lastName: 'Roels',
    email: 'stef.roels@gmail.com',
    password: 'abcd1234'
  },
  {
    id : 3,
    firstName: 'Robbe',
    lastName: 'Vervaet',
    email: 'robbe.vervaet@gmail.com',
    password: 'abcd1234'
  },
];

let COLLECTIONS_DATA = [
  {
    id : 1,
    userId : 1,
    value : 100000
  },
  {
    id : 2,
    userId : 1,
    value : 200.25
  },
];


let COINS_DATA = [
  {
    id : 1,
    name: 'Bitcoin',
    value: 34000,
    collectionId: 1,
    favorite: true
  },
  {
    id : 2,
    name: 'Ethereum',
    value: 1800,
    collectionId: 1,
    favorite: true
  },
  {
    id : 3,
    name: 'BNB',
    value: 200,
    collectionId: 1
  },
  {
    id : 4,
    name: 'Random',
    value: 200,
    collectionId: 2
  }
]

module.exports = { USER_DATA, COLLECTIONS_DATA, COINS_DATA };