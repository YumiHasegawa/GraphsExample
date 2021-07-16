using System.Collections.Generic;
using System.Dynamic;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
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
    }
}
