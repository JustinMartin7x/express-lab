const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const { DH_NOT_SUITABLE_GENERATOR } = require('constants');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
  it('finds a recipe by id using GET route', async() => {
    const recipe = await Recipe.insert({
      name: 'brownies',
      ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on glass sheet',
        'bake for 20 minutes'
      ],
    });

    return request(app)
    .get(`/api/v1/recipes/${recipe.id}`)
    .then(res => {
      expect(res.body).toEqual(recipe);
    });
  })

  it('should delete a recipe using the Delete route', async() => {
    const recipe = await Recipe.insert({
      name: 'cake',
      ingredients:[{'name': 'sugar', 'amount': '1cup', measurement: '1cup'}],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on glass sheet',
        'bake for 20 minutes'
      ],
    });
    return request(app)
    .delete(`/api/v1/recipes/${recipe.id}`)
    .then(res => {
      expect(res.body).toEqual(recipe);
    });
  })



  })

