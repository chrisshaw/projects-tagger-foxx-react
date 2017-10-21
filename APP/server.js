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
        console.log('New project endpoint hit.')
        const project = db._query(aql`
            for p in projects
            filter !HAS(p, 'topics')
            sort RAND()
            limit 1
            return KEEP(p, '_id', '_key', 'name', 'link', 'details')
        `).toArray().pop()
        console.log(`Project is ${project.name}`)
        res.status(200).json(project)
    } catch (err) {
        res.sendStatus(500)
    }
})

// put, post, or patch?
router.post('/api/:projectKey/update', (req, res) => {
    try {
        console.log('>>>>>>> Project update endpoint hit.')
        const projects = db.projects
        const projectKey = req.pathParams.projectKey
        console.log(`Project key: ${projectKey}`)
        console.log(`Request body: ${req.body}`)
        for (const [key, value] of Object.entries(req.body)) {
            console.log(key, value)
        }
        const topics = req.body.tags

        const project = projects.document(projectKey.toString())
        console.log(project)
        const result = projects.update(project, { topics: topics })
        console.log('Project updated.')
        res.status(200).json( { responseMessage: `Project ${projectKey} updated with ${topics.join(', ')}` })
    } catch (err) {
        console.log(err.toString())
        res.status(500).json( { responseMessage: err.toString } )
    }
})
.pathParam('projectKey', joi.number().required())
.queryParam('topics', joi.string())
.body(joi.object().required())

router.get('/api/autocomplete', (req, res) => {
    try {
        const result = db._query(aql`
            for p in projects
            filter HAS(p, 'topics')
                for t in p.topics
                sort t desc
                return distinct t
        `).toArray()
        console.log('Autocomplete options endpoint reached.')
        console.log(result)
        res.status(200).json( { tags: result } )
    } catch (err) {
        res.sendStatus(500)
    }
})