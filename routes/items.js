const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get('/', (req, res) => {
    res.json({ items })
})

router.post('/', (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required.", 400);
        if (!req.body.price) throw new ExpressError("Price is required.", 400);
        let newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ item_added: newItem })
    } catch (e) {
        return next(e)
    }
})

router.get('/:name', (req, res) => {
    let foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found.", 404);
    return res.json({ foundItem })
})

router.patch("/:name", (req, res) => {
    let foundItem = items.find(item => item.name === req.params.name);
    console.log(foundItem)
    if (foundItem === undefined) throw new ExpressError("Item not found.", 404);
    if (req.body.name) foundItem.name = req.body.name;
    if (req.body.price) foundItem.price = req.body.price;
    return res.json({ updated: foundItem })
})

router.delete("/:name", (req, res) => {
    let foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found.", 404);
    items.splice(foundItem, 1);
    return res.json({ message: "Deleted." });
})

module.exports = router;