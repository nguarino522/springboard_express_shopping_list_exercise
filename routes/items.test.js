process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let kale = { "name": "kale", "price": 5.22 };
let taco_sauce = { "name": "taco sauce", "price": 3.77 };


beforeEach(function () {
    items.push(kale);
    items.push(taco_sauce);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items:", async () => {
        let res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [kale, taco_sauce] })
    });
})

describe("GET /items/:name", () => {
    test("Get item by name:", async () => {
        let res = await request(app).get(`/items/${kale.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ foundItem: kale })
    })
    test("Responds with 404 for invalid cat", async () => {
        let res = await request(app).get(`/items/icecube`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating a new item:", async () => {
        let res = await request(app).post("/items").send({ name: "test", price: 5.22 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ item_added: { name: "test", price: 5.22 } });
    })
    test("Responds with 400 if name is missing", async () => {
        let res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item:", async () => {
        let res = await request(app).patch(`/items/${kale.name}`).send({ name: "kale1" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "kale1", price: 5.22 } });
        res = await request(app).patch(`/items/${taco_sauce.name}`).send({ name: "taco", price: 99.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "taco", price: 99.99 } });
    })
    test("Responds with 404 for invalid name", async () => {
        let res = await request(app).patch(`/items/asdfasd`).send({ name: "cheese" });
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item:", async () => {
        const res = await request(app).delete(`/items/${kale.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted." })
    })
    test("Responds with 404 for deleting invalid cat", async () => {
        const res = await request(app).delete(`/items/ham`);
        expect(res.statusCode).toBe(404);
    })
})