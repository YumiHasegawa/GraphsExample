using GraphsExample.Models;
using GraphsExample.ViewModels;
using Highsoft.Web.Mvc.Charts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Omu.AwesomeMvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;

namespace GraphsExample.Controllers
{
    public class HighchartsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        private object MapToGridModel(HighchartsViewModel o)
        {
            return
                new
                {
                    o.Values,
                };
        }

        public IActionResult GridGetItemsAsync(GridParams g)
        {
            double count = 100, y = 10;
            Random random = new Random();
            List<DataPoint> dataPoints = new List<DataPoint>();

            for (int i = 0; i < count; i++)
            {
                y += random.Next(-10, 11);
                dataPoints.Add(new DataPoint(i, y));
            }

            var items = new List<HighchartsViewModel>() { new HighchartsViewModel { Id = 1, Values = dataPoints } };
            return Json(new GridModelBuilder<HighchartsViewModel>(items.AsQueryable(), g)
            {
                Key = "Id", // needed for api select, update, tree, nesting, EF
                GetItem = () => items.FirstOrDefault(i => i.Id == Convert.ToInt64(g.Key)), // called by the grid.api.update ( edit popupform success js func )
                Map = MapToGridModel
            }.Build());
        }
    }
}
