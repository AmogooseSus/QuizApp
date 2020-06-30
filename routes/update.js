const express = require("express");
const router = express.Router();
const itemHandler = require("../config/itemExecution.js");
const Item = require("../models/Item.js");

router.post("/buyItem",async (req,res) =>
{
  try
  {
    let item = await Item.findById(req.body.id);

    for(let i = 0; i < itemHandler.length; i++)
    {
      if(itemHandler[i].ItemType === item.ItemType) return await itemHandler[i].Execution(req.user,item,res);
    }
  }
  catch
  {
    res.json({Sucess: false});
  }
})


module.exports = router;
