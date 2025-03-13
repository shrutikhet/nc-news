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
      });
  });
  test("200: Responds with all the articles with sort order votes order by desc", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        console.log(articles);
        expect(articles.length).toBe(13);
        expect(articles[0].votes>= articles[1].votes).toBe(true);
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with comments for article 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
        });
      });
  });
  test("404: Responds with not found when passed with incorrect value", () => {
    return request(app)
      .get("/api/articles/89/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Id not found!!");
      });
  });

  test("404: Responds with not found when passed with incorrect value", () => {
    return request(app)
      .get("/api/articles/sdfj/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });
});

describe("POST: Responds adding a comment for the article id", () => {
  test("201: Comments is added for username butter_bridge", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .set("Accept", "application/json")
      .send({ username: "butter_bridge", body: "Hello!!" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe("Hello!!");
      });
  });

  test("400: Comments being added for user that does not exists", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .set("Accept", "application/json")
      .send({ username: "shruti", body: "Hello!!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("shruti does not exists!! Create first");
      });
  });

  test("404: Comments cannot be added as article id 89 does not exists", () => {
    return request(app)
      .post("/api/articles/89/comments")
      .set("Accept", "application/json")
      .send({ username: "butter_bridge", body: "Hello!!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Id not found!!");
      });
  });

  test("400: Comments cannot be added as there is no body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .set("Accept", "application/json")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username does not exists!!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates the article by increasing or descresing the votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .set("Accept", "application/json")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(101);
      });
  });

  test("200: decreases the votes for the article_id", () => {
    return request(app)
      .patch("/api/articles/1")
      .set("Accept", "application/json")
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(98);
      });
  });

  test("400: gets a bad request as the number sent is a string", () => {
    return request(app)
      .patch("/api/articles/1")
      .set("Accept", "application/json")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!!");
      });
  });

  test("400: gets a bad request as article_id does not exists", () => {
    return request(app)
      .patch("/api/articles/89")
      .set("Accept", "application/json")
      .send({ inc_votes: "1" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article id does not exists");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204 deletes the comments for comment id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });

  test("404: comment id to be deleted not found", () => {
    return request(app)
      .delete("/api/comments/900")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Not Found");
      });
  });

  test("400: comment id is in wrong format", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request!!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: gets all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("", () => {
  test("" , () => {

  })
})
