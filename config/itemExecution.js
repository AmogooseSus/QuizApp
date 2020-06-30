module.exports =
[
  {
    ItemType:"CategoryUpgrade",
    Execution: async (user,item,res) =>
    {
      if(user.Coins - item.ItemPrice >= 0)
      {
        user.Coins -=  item.ItemPrice;
        user.CategoriesUnlocked.push(item.ItemData[0]);

        await user.save();

        return res.json({Sucess: true});
      }

      res.json({Sucess: false});
    }
  },
  {
    ItemType: "CSlotUpgrade",
    Execution: async(user,item,res) =>
    {
      if(user.Coins - item.ItemPrice >= 0)
      {
        user.Coins -=  item.ItemPrice;
        user.CQuizSlots++;

        await user.save();

        return res.json({Sucess: true});
      }

      res.json({Sucess: false});
     }
  }
]
