import { faker } from './faker';

export const teachers = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 17, max: 20 }),
  email: faker.internet.email(),
}));

export const students = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 1).toString(),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 17, max: 20 }),
  email: faker.internet.email(),
}));
