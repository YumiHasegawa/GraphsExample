using GraphsExample.Models;
using GraphsExample.ViewModels;
using Highsoft.Web.Mvc.Charts;
using Highsoft.Web.Mvc.Charts.Rendering;
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


        [HttpGet]
        public IActionResult GetChartByValues(string valuesStr, string chartName)
        {
            try
            {
                List<ColumnSeriesData> data = new List<ColumnSeriesData>();
                var values = JsonConvert.DeserializeObject<List<DataPoint>>(valuesStr);
                if (values == null)
                {
                    return null;
                }

                values.ToList().ForEach(p => data.Add(new ColumnSeriesData
                {
                    X = p.X,
                    Y = p.Y
                }));

                var chartOptions = new Highcharts
                {
                    Title = new Title
                    {
                        Text = "Monthly Average Rainfall"
                    },

                    XAxis = new List<XAxis> { new XAxis { Min = 0, Title = new XAxisTitle { Text = "XValues" } } },
                    YAxis = new List<YAxis> { new YAxis { Min = 0, Title = new YAxisTitle { Text = "YValues" } } },
                    Tooltip = new Tooltip
                    {
                        HeaderFormat = "<span style='font-size:10px'>{point.key}</span><table style='font-size:12px'>",
                        PointFormat = "<tr><td style='color:{series.color};padding:0'>{series.name}: </td><td style='padding:0'><b>{point.y:.1f} mm</b></td></tr>",
                        FooterFormat = "</table>",
                        Shared = true,
                        UseHTML = true
                    },
                    PlotOptions = new PlotOptions
                    {
                        Column = new PlotOptionsColumn
                        {
                            PointPadding = 0.2,
                            BorderWidth = 0
                        }
                    },
                    Series = new List<Series> { new ColumnSeries { Name = chartName, Data = data } }
                };
                chartOptions.ID = $"{chartName}";
                var renderer = new HighchartsRenderer(chartOptions);
                return Json(renderer.RenderHtml());
            }
            catch
            {
                return null;
            }
        }
    }
}
