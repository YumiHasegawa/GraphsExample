using GraphsExample.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Omu.AwesomeMvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphsExample.Controllers
{
    public class MicrosoftChartsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        private object MapToGridModel(MicrosoftChartsViewModel o)
        {
            return
                new
                {
                    o.Values
                };
        }

        public IActionResult GridGetItemsAsync(GridParams g)
        {
            var values = new Dictionary<System.DateTime, decimal>() {
                { DateTime.UtcNow, 1},
                { DateTime.UtcNow.AddDays(-1), 2},
                { DateTime.UtcNow.AddDays(-1), 3},
                { DateTime.UtcNow.AddDays(-1), 4.73m},
                { DateTime.UtcNow.AddDays(-1), -5},
                { DateTime.UtcNow.AddDays(-1), -10.2m},
            };
            var items = new List<MicrosoftChartsViewModel>() { new MicrosoftChartsViewModel { Values = values } };
            return Json(new GridModelBuilder<MicrosoftChartsViewModel>(items.AsQueryable(), g)
            {
                Key = "Id", // needed for api select, update, tree, nesting, EF
                GetItem = () => items.FirstOrDefault(i => i.Id == Convert.ToInt64(g.Key)), // called by the grid.api.update ( edit popupform success js func )
                Map = MapToGridModel
            }.Build());
        }
    }
}
