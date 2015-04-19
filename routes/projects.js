import { Router } from 'express';
import sendResponse from '../lib/response';

const router = Router();

let privateFields = [
  'createdAt',
  'updatedAt',
  'inspect',
  'members',
  'id'
];

function removePrivateFields(record) {
  return Object.keys(record)
    .filter((field) => {
      return !privateFields.includes(field);
    })
    .reduce((o, k) => {
      return Object.assign(o, { [k]: record[k] });
    }, {})
}

router.get('/', (req, res) => {
  const { project: Project } = req.app.models;

  Project.find()
    .then((projects) => {
      sendResponse(res, 200, { projects: projects.map(removePrivateFields) });
    })
    .catch((err) => {
      sendResponse(res, 500, { message: 'Internal error occured.' });
    });
});

router.post('/', (req, res) => {
  const { project: Project, tag: Tag } = req.app.models;
  const {
    title: name,
    tagline,
    logo: avatar_url,
    description,
    site: site_url,
    github: github_url,
    tags,
    user } = req.body;

  const formattedTags = tags.split(',').map((t) => t.trim());
  const projectTags = formattedTags.map((tag) => Object({ value: tag }));

  (async function () {
    try {
      let tags = [];

      for (let tag of projectTags) {
        let { id } = await Tag.findOrCreate(tag);
        tags.push(id);
      }

      const attributes = {
        name,
        description,
        avatar_url,
        tagline,
        site_url,
        github_url
      };

      let project = await Project.find(attributes);

      if (project.length === 0) {
        project = await Project.create(attributes);
        project.tags.add(tags);
        project.members.add(req.user.id);
        project = await project.save();

        sendResponse(res, 200, { project });
      }

      sendResponse(res, 200, { project: project[0] });
    }
    catch (e) {
      console.log(e);
      sendResponse(res, 500, { message: 'Error creating project.' });
    }
  })();
});

router.get('/:id', (req, res) => {
  const { project: Project } = req.app.models,
        { id } = req.params;

  (async function () {
    try {
      let project = await Project.find(id).populate('members');
      sendResponse(res, 200, { project: project[0] });
    }
    catch (e) {
      sendResponse(res, 500, { message: 'Error finding Project.' });
    }
  })();
})

export default router;
