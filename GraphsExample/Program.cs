using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using SerilogTools;
using SerilogTools.Serilog;
using GraphsExample.Helpers.AppSettings;
using GraphsExample.Helpers.Service;

namespace GraphsExample
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try 
            {
                CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
                CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                var pathToContentRoot = Path.GetDirectoryName(pathToExe);
                Directory.SetCurrentDirectory(pathToContentRoot);

                var commandLineArgs = new Dictionary<string, string>
                {
                    {"console", args.Contains("--console") ? "True" : "False"},
                    {"disable", args.Contains("--disable") ? "True" : "False"}
                };

                SerilogUtils.ConfigureLogger(
                    settings: null,
                    useSyslog: false);

                var config = new ConfigurationBuilder()
                    .AddJsonFile("Contents/appsettings.json", optional: false)
                    .AddInMemoryCollection(commandLineArgs)
                    .Build();
                var consoleMode = config.GetValue<bool>("console");

                var isService = !(Debugger.IsAttached || consoleMode);

                var settingsWeb = new WebProtocolSettings();
                config.GetSection("WebProtocolSettings").Bind(settingsWeb);

                var host = new WebHostBuilder()
                    .UseIISIntegration()
                    .UseKestrel()
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseConfiguration(config)
                    .UseStartup<Startup>()
                    .UseUrls(urls: "http://" + settingsWeb.Url + ":" + settingsWeb.Port)
                    .Build();

                if (isService)
                {
                    // To run the app without the CustomWebHostService change the
                    // next line to host.RunAsService();
                    host.RunAsCustomService();
                }
                else
                {
                    host.Run();
                }
            }
            catch (IOException e)
            {
                if (e.Message.Contains("address already in use"))
                    Log.Error(e.Message + " Try to change port or ip in appsettings.json file.");
                else
                    Log.Error(e.ToString());
            }
            catch (Exception e)
            {
                Log.Fatal(e, "Critial error, please contact support.");
            }
        }
    }
}
