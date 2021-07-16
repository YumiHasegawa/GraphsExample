using Newtonsoft.Json;

namespace GraphsExample.Helpers
{
    public static class Autil
    {
        public static string JsonEncode(object o)
        {
            return JsonConvert.SerializeObject(o, Formatting.None, new JsonSerializerSettings { StringEscapeHandling = StringEscapeHandling.EscapeHtml });
        }
    }
}
