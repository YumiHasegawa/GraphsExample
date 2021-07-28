using GraphsExample.Models;
using GraphsExample.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Omu.AwesomeMvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GraphsExample.Controllers
{
    public class ChartJSController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.TestValues = JsonConvert.SerializeObject(GetRandomDataPoints());
            return View();
        }

        private object MapToGridModel(ChartJSViewModel o)
        {
            return
                new
                {
                    o.Id,
                    o.Values,
                };
        }

        public IActionResult GridGetItemsAsync(GridParams g)
        {
            var items = new List<ChartJSViewModel>() {
                new ChartJSViewModel { Id = 1, Values = GetRandomDataPoints() },
                new ChartJSViewModel { Id = 2, Values = GetRandomDataPoints() },
                new ChartJSViewModel { Id = 3, Values = GetRandomDataPoints() }
            };

            return Json(new GridModelBuilder<ChartJSViewModel>(items.AsQueryable(), g)
            {
                Key = "Id", // needed for api select, update, tree, nesting, EF
                GetItem = () => items.FirstOrDefault(i => i.Id == Convert.ToInt64(g.Key)), // called by the grid.api.update ( edit popupform success js func )
                Map = MapToGridModel
            }.Build());
        }

        private List<DataPoint> GetRandomDataPoints()
        {
            Random random = new Random();
            List<DataPoint> dataPoints = new List<DataPoint>();

            for (int i = 0; i < 50; i++)
            {
                dataPoints.Add(new DataPoint(i, random.Next(0, 10)));
            }

            return dataPoints;
        }
    }
}
