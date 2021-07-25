using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using GraphsExample.Models;
using Highsoft.Web.Mvc.Charts;
using Highsoft.Web.Mvc.Charts.Rendering;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Omu.AwesomeMvc;

namespace GraphsExample.Helpers
{
    public static class GridUtils
    { 
        public static string SubscribeFormatForGrid(string gridId, string key = "Id", bool setId = false, bool nofocus = false, Dictionary<string, object> parameters = null)
        {
            return SubscribeFormat("subscribe" + gridId, key, setId, nofocus, parameters);
        }

        public static string UnsubscribeFormatForGrid(string gridId, string key = "Id", string id = "0", bool setId = false, bool nofocus = false, bool disable = false, Dictionary<string, object> parameters = null)
        {
            return UnsubscribeFormat("unsubscribe" + gridId, key, id, setId, nofocus, disable, parameters);
        }

        public static string EditFormatForGrid(string gridId, string key = "Id", string id = "0", bool setId = false, bool nofocus = false, bool disable = false, Dictionary<string, object> parameters = null)
        {
            return EditFormat("edit" + gridId, key, id, setId, nofocus, disable, parameters);
        }

        public static string SubscribeFormat(string popupName, string key = "Id", bool setId = false, bool nofocus = false, object parameters = null)
        {
            var idattr = "";
            if (setId)
            {
                idattr = $"id = 'gbtn{popupName}.{key}'";
            }

            parameters = ConstructNewParametersWithId(key, parameters);

            var customParamsString = Autil.JsonEncode(parameters).Replace("\"", "'");
            var tabindex = nofocus ? "tabindex = \"-1\"" : string.Empty;

            return
                $"<button type=\"button\" class=\"awe-btn awe-nonselect editbtn\" {tabindex} {idattr} onclick=\"awe.open('{popupName}', {{ params: {customParamsString}}}, event)\"><span>Subscribe</span></button>";
        }

        public static string UnsubscribeFormat(string popupName, string key = "Id", string id = "0", bool setId = false, bool nofocus = false, bool disable = false, object parameters = null)
        {
            var idattr = "";
            if (setId)
            {
                idattr = $"id = 'gbtn{popupName}.{id}'";
            }

            var disabled = disable ? "disabled" : "";

            parameters = ConstructNewParametersWithId(key, parameters);

            var customParamsString = Autil.JsonEncode(parameters).Replace("\"", "'");

            var tabindex = nofocus ? "tabindex = \"-1\"" : string.Empty;

            return
                $"<button type=\"button\" class=\"awe-btn awe-nonselect delbtn \" {tabindex} {idattr} {disabled} onclick=\"awe.open('{popupName}', {{ params: {customParamsString}}}, event)\">Unsubscribe</button>";
        }

        public static string EditFormat(string popupName, string key = "Id", string id = "0", bool setId = false, bool nofocus = false, bool disable = false, object parameters = null)
        {
            var idattr = "";
            if (setId)
            {
                idattr = $"id = 'gbtn{popupName}.{id}'";
            }

            var disabled = disable ? "disabled" : "";

            parameters = ConstructNewParametersWithId(key, parameters);

            var customParamsString = Autil.JsonEncode(parameters).Replace("\"", "'");
            var tabindex = nofocus ? "tabindex = \"-1\"" : string.Empty;

            return
                $"<button type=\"button\" class=\"awe-btn awe-nonselect editbtn\" {tabindex} {idattr} {disabled} onclick=\"awe.open('{popupName}', {{ params: {customParamsString}}}, event)\"><span>Edit</span></button>";
        }

        private static object ConstructNewParametersWithId(string id, object parameters)
        {
            if (parameters == null)
            {
                parameters = new { id = $".({id})" };
            }
            else
            {
                var newParameters = new ExpandoObject();
                foreach (var property in parameters.GetType().GetProperties())
                {
                    AddProperty(ref newParameters, property.Name, property.GetValue(parameters));
                }

                AddProperty(ref newParameters, "id", $".({id})");

                parameters = newParameters;
            }

            return parameters;
        }

        private static void AddProperty(ref ExpandoObject expando, string propertyName, object propertyValue)
        {
            // ExpandoObject supports IDictionary so we can extend it like this
            var expandoDict = expando as IDictionary<string, object>;
            if (expandoDict.ContainsKey(propertyName))
                expandoDict[propertyName] = propertyValue;
            else
                expandoDict.Add(propertyName, propertyValue);
        }

        public static IHtmlContent CreateCustomPopupButton<T>(this IHtmlHelper<T> html, string popup = "", string text = "Create", bool isEnabled = true)
        {
            return html.Awe().Button()
                .Text(text)
                .OnClick(html.Awe().OpenPopup(popup))
                .Enabled(isEnabled);
        }

        public static IHtmlContent CreateButtonCustomOnClick<T>(this IHtmlHelper<T> html, string text, string onClick)
        {
            return html.Awe().Button()
                .Text(text)
                .OnClick(onClick);
        }

        public static string GetGraph(string valuesStr, string chartName)
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
                return renderer.RenderHtml();
            }
            catch
            {
                return null;
            }
        }
    }
}
