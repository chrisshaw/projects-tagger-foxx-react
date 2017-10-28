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

router.get('/api/any-project', (req, res) => {
    try {
        console.log('New project endpoint hit.')
        const project = db._query(aql`
            for p in projects
            sort RAND()
            limit 1
            return MERGE(
                KEEP(p, '_id', '_key', 'name', 'link', 'details', 'topics'),
                { standards: (
                    for s
                    in outbound p._id
                    alignsTo
                    filter IS_SAME_COLLECTION('standards', s._id)
                    sort s._key desc
                    return s._key
                ) }
            )
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
        console.log('Autocomplete endpoint reached.')
        const result = db._query(aql`
            let standards = (
                for s in standards
                sort s._id desc
                return distinct s._key
            )
            let topics = (
                for p in projects
                filter HAS(p,'topics')
                    for t in p.topics
                    sort t desc
                    return distinct t
            )
            let products = (
                for p in projects
                filter HAS(p.details, 'finalProducts')
                    and LENGTH(p.details.finalProducts) > 0
                    for pr in p.details.finalProducts
                    sort pr desc
                    return distinct pr
            )
            let checkpoints = (
                for p in projects
                filter HAS(p.details, 'checkpoints')
                    and LENGTH(p.details.checkpoints) > 0
                    for c in p.details.checkpoints
                    sort c desc
                    return distinct c
            )
            return {
                'standards': standards,
                'topics': topics,
                'products': products,
                'checkpoints': checkpoints
            }
        `).toArray()
        console.log('Autocomplete options found.')
        console.log(result)
        res.status(200).json( { options: result.pop() } )
    } catch (err) {
        console.log(err.toString())
        res.sendStatus(500)
    }
})