const arangodb = require('@arangodb')
const db = arangodb.db
const aql = arangodb.aql
const createRouter = require('@arangodb/foxx/router')
const joi = require('joi')

const router = createRouter()
module.context.use(router)

const logProps = object => {
    Object.entries(object).forEach( ([key, value]) => console.log(key, value) )
}

router.get( (req, res) => {
    // send the app up
})

router.get('/api/any-project', (req, res) => {
    try {
        console.log('New project endpoint hit.')
        const project = db._query(aql`
            for p in projects
            filter !HAS(p, 'topics')
                or LENGTH(p.topics) == 0
            sort RAND()
            limit 1
            return MERGE(
                KEEP(p, '_id', '_key', 'name', 'link', 'details', 'topics'),
                { source: FIRST(
                    let realPartner = FIRST(
                        for pa
                        in inbound p
                        placeOf
                        return pa
                    )
                    let returnObject = LENGTH(realPartner) > 0 ? { name: realPartner.name, id: realPartner._id } : { name: p.source, id: CONCAT('_seed_', p.source) }
                    return returnObject

                ) },
                { standards: (
                    for s
                    in outbound p._id
                    alignsTo
                    filter IS_SAME_COLLECTION('standards', s._id)
                    sort s._key desc
                    return distinct s._key
                ) }
            )
        `).toArray().pop()
        logProps(project)
        console.log(`Project is ${project.name}`)
        res.status(200).json( project )
    } catch (err) {
        console.log(err)
        res.throw(err)
    }
})

// put, post, or patch?
router.post('/api/:projectKey/update', (req, res) => {
    console.log('>>>>>>> Project update endpoint hit.')

    try {
        const projectKey = req.pathParams.projectKey
        const updatedAttributes = req.body
        const standards = updatedAttributes.standards
        delete updatedAttributes.standards
        const source = Object.assign({}, updatedAttributes.source)
        updatedAttributes.source = updatedAttributes.source.name
        updatedAttributes.details = {
            drivingQuestion: updatedAttributes.drivingQuestion,
            overview: updatedAttributes.overview,
            finalProducts: updatedAttributes.finalProducts,
            checkpoints: updatedAttributes.checkpoints,
            requirements: updatedAttributes.requirements
        }
        delete updatedAttributes.drivingQuestion
        delete updatedAttributes.overview
        delete updatedAttributes.finalProducts
        delete updatedAttributes.checkpoints
        delete updatedAttributes.requirements

        console.log(`Project key: ${projectKey}`)
        logProps(updatedAttributes)

        const transaction = {
            collections: {
              write: ['projects', 'alignsTo', 'partners', 'placeOf']
            },
            action: params => {
                const db = require('@arangodb').db                
                const projects = db.projects
                const alignsTo = db.alignsTo
                const partners = db.partners
                const placeOf = db.placeOf

                const projectKey = params.projectKey
                const source = params.source
                const updatedAttributes = params.updatedAttributes
                const standardConnections = params.standardConnections
                const transactionTimestamp = Date.now()

                const project = projects.document(projectKey.toString())
                logProps(project)

                const projectResult = projects.update(project, updatedAttributes)
                standardConnections.forEach( standardConnection => {
                    const edge = {
                        _from: `projects/${projectKey}`,
                        _to: `standards/${standardConnection}`,
                        creator: updatedAttributes.source,
                        created: transactionTimestamp
                    }
                    const alignsToResult = alignsTo.save(edge)
                })
                let partner = ''
                if (source.id.includes('_seed_')) {
                    partner = 'partners/16332587'
                } else {
                    const partnerResult = partners.save({
                        name: source.name,
                        creator: 'Partner Acquisition',
                        created: transactionTimestamp
                    })
                    partner = partnerResult._id
                }
                const placeOfEdge = {
                    _from: partner,
                    _to: `projects/${projectKey}`,
                    creator: source.name,
                    created: transactionTimestamp
                }
                placeOfResult = placeOf.save(placeOfEdge)
                console.log('Project updated.')
            },
            params: {
                projectKey: projectKey,
                source: source,
                updatedAttributes: updatedAttributes,
                standardConnections: standards
            }
        }
        const transactionResult = db._executeTransaction(transaction)
        console.log(transactionResult)
        res.status(200).json( { responseMessage: `Project ${projectKey} updated.` } )
    } catch (e) {
        console.log(e.toString())
        res.throw(e)
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
            let sources = FIRST(
                let partners = (
                    for p in partners
                    filter p._id != 'partners/16332587' // filter out _seedProjects
                    sort p.name desc
                    return distinct { name: p.name, id: p._id }
                )
                let seedSources = (
                    for p in projects
                    filter HAS(p, 'source')
                        and LENGTH(p.source) > 0
                    sort p.source desc
                    return distinct { name: p.source, id: CONCAT('_seed_', p.source) }
                )
                return UNION_DISTINCT(partners, seedSources)
            )
            return {
                'standards': standards,
                'topics': topics,
                'finalProducts': products,
                'checkpoints': checkpoints,
                'source': sources
            }
        `).toArray().pop()
        console.log('Autocomplete options found.')
        // console.log(result)
        res.status(200).json( result )
    } catch (err) {
        console.log(err.toString())
        res.throw(err)
    }
})