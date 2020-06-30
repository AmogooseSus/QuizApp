let items = document.querySelectorAll(".buy-btn");

items.forEach((item) =>
{
  item.addEventListener("click",() =>
  {
    makeBuyRequest(item.parentElement.id);
  })
})

function makeBuyRequest(id)
{
  fetch("/update/buyItem",
  {
    headers:
    {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({id})
  })
  .then(res => res.json())
  .then(data =>
    {
      if(data.Sucess === true)
      {
        return window.location.href = window.location.href;
      }

      alert("You don't have enough coins to buy this");
    });
}
