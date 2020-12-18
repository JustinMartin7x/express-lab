const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/Logs');
const Recipe = require('../lib/models/recipe');
const { hasUncaughtExceptionCaptureCallback } = require('process');



describe('logs-lab routes', () => {
    beforeEach(() => {
      return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

  it ('should create a new log', async() => {
    const recipe = await Recipe.insert({ name: 'potatoe', directions: ['put the lime in the coconut']});

    const res  = await request(app)
    .post('/api/v1/log')
    .send({ 
        recipeId: recipe.id,
        dateOfEvent: 'today',
        notes: 'hot hot potato',
        rating: 10,
        
    })
    expect(res.body).toEqual({ 
        id: "1",
        recipeId: recipe.id,
        dateOfEvent: 'today',
        notes: 'hot hot potato',
        rating: 10  
    })
  })
  it ('should get all logs using GET', async() => {
      const recipe = await Recipe.insert({
          name: 'caldron stew',
          directions: [
              'bubble bubble toil and trouble'
          ]
      })
      const logs = await Promise.all([ 
        { 
            recipeId: recipe.id,
            dateOfEvent: 'today',
            notes: 'cauldron burn',
            rating: 10  
        },
        { 
            recipeId: recipe.id,
            dateOfEvent: 'today',
            notes: 'contents bubble',
            rating: 10  
        }].map(log => Log.insert(log)));

        const res = await request(app)
        .get('/api/v1/log')


        expect(res.body).toEqual(expect.arrayContaining(logs))
  })

  it ('should find a log by id uing the GET route', async() => {

    const recipe = await Recipe.insert({
        name: 'totaly not horrible food',
        directions: [
            'dont burn it'
        ]
    })
    const log = await Log. insert({
            recipeId: recipe.id,
            dateOfEvent: 'tomorrow',
            notes: 'hahahaha you burned it',
            rating: 1  
    })
    const res = await request(app)
    .get(`/api/v1/log/${log.id}`)
    expect(res.body).toEqual(log)
  })

  it ('should update a log by id using the put method', async() => {
    const recipe = await Recipe.insert({
        name: 'good old fashion beer',
        directions: [
            'yay we have beer'
        ]
    })
    const log = await Log.insert({
        recipeId: 1,
        dateOfEvent: 'who knows',
        notes: 'we smammerd now',
        rating: 10  
    })

    const res = await request(app)
    .put(`/api/v1/log/${log.id}`)
    .send({
        recipeId: 1,
        dateOfEvent: 'who knows',
        notes: 'now we sober that was good',
        rating: 10  
    })
    expect(res.body).toEqual({
        id: log.id,
        recipeId: "1",
        dateOfEvent: 'who knows',
        notes: 'now we sober that was good',
        rating: 10  
    })

  })
  it ('should delete a log by id using the DELETE route', async() => {

    const recipe = await Recipe.insert({
        name: 'spinache deserves to be deleted',
        directions: [
            'bye by log'
        ]
    })
    const log = await Log.insert({
        recipeId: recipe.id,
        dateOfEvent: 'im in danger',
        notes: 'delete me',
        rating: 10  
    })
    const res = await request(app)
    .delete(`/api/v1/log/${log.id}`)

    expect(res.body).toEqual(log)

  })




})