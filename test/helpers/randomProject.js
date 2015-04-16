import Faker from 'faker';

function randomProject() {
  return {
    name: Faker.name.findName(),
    description: Faker.lorem.paragraph(),
    avatar_url: Faker.image.imageUrl()
  };
}

export default randomProject;
