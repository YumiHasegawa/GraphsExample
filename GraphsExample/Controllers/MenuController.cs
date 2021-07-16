using System.Linq;
using GraphsExample.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

namespace GraphsExample.Controllers
{
    public class MenuController : Controller
    {
        public IActionResult GetMenuNodes()
        {
            var menuNodes =
                MySiteMap.GetAll().Select(
                    o =>
                        new
                        {
                            o.Id,
                            o.Name,
                            o.Keywords,
                            ParentId = o.Parent?.Id ?? 0,
                            Url = o.Action != null ? Url.Action(o.Action, o.Controller) + o.Anchor : null,
                            o.Action,
                            o.Controller,
                            o.Collapsed,
                            o.NoMenu,
                            o.Anchor
                        });

            return Json(menuNodes, new JsonSerializerSettings());
        }
    }
}
