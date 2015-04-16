import Faker from 'faker';

function randomUser() {
  return {
    name: Faker.name.findName(),
    bio: Faker.lorem.paragraph(),
    email: Faker.internet.email(),
    provider: Faker.company.companyName(),
    provider_id: Faker.helpers.randomNumber(),
    avatar_url: Faker.image.imageUrl(),
    github_url: Faker.internet.domainName(),
    github_api_url: Faker.internet.domainName(),
    public_repos_count: Faker.helpers.randomNumber(),
    follower_count: Faker.helpers.randomNumber(),
    following_count: Faker.helpers.randomNumber()
  };
}

export default randomUser;
