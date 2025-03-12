const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET api/topics", () => {
  test("200: Responds with all the topics present", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET api/topicss", () => {
  test("404: Responds with error saying Not Found!!", () => {
    return request(app)
      .get("/api/topicss")
      .expect(404)
      .then((error) => {
        expect(error.status).toBe(404);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("404: Responds with path not found", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Endpoint!!");
      })

  })
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article present for the article id given", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(typeof article).toBe("object");
        expect(article.article_id).toBe(1);
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.author).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("404: /api/articles/999999 Responds with non found", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article id not found!!");
      });
  });
});

describe("GET /api/article/:article_id", () => {
  test("404: api not found", () => {
    return request(app)
      .get("/api/article/1")
      .expect(404)
      .then((error) => {
        expect(error.status).toBe(404);
      });
  });
});
