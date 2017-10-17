/*

*** TO DO ***

[x] add create-react-app as global dependency
[x] create repo on Github
[x] clone project in VS Code
[x] create react app in new project (call the folder APP)
[x] move this file over to the new file as the main entry point
[] create front-end using material-ui next
[] create foxx manifest

*/

const arangodb = require('@arangodb')
const db = arangodb.db
const aql = arangodb.aql
const createRouter = require('@arangodb/foxx/router')
const joi = require('joi')

const router = createRouter()
module.context.use(router)


router.get( (req, res) => {
    // send the app up
})

router.get('/api/new-project', (req, res) => {
    try {
        const topics = db._query(aql`
            for p in projects
            filter !HAS(p, 'topics')
            sort RAND()
            limit 1
            return KEEP(p, '_id', '_key', 'name', 'link', 'details')
        `).toArray()
        res.status(200).json(topics)
    } catch (err) {
        res.sendStatus(500)
    }
})

// put, post, or patch?
router.put('/api/projects/:projectKey', (req, res) => {
    try {
        const projects = db.projects
        const projectKey = req.pathParams.projectKey
        const topics = req.queryParams.topics.split(',')

        const project = projects.document(projectKey)
        const result = projects.update(project, { topics: topics })
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})
.pathParam('projectKey', joi.number().required())
.queryParam('topics', joi.string())

router.get('/api/autocomplete', (req, res) => {
    try {
        const result = db._query(aql`
            for p in projects
            filter HAS(p, 'topics')
                for t in p.topics
                return distinct t
        `).toArray()
        res.status(200).json(result)
    } catch (err) {
        res.sendStatus(500)
    }
})