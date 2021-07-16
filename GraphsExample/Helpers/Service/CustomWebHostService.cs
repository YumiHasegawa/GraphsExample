using System;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GraphsExample.Helpers.Service
{
    internal class CustomWebHostService : ServiceBase
    {
        private readonly IWebHost _host;
        private bool _stopRequestedByWindows;

        private CancellationTokenSource cts = new CancellationTokenSource();

        /// <summary>
        /// Creates an instance of <c>WebHostService</c> which hosts the specified web application.
        /// </summary>
        /// <param name="host">The configured web host containing the web application to host in the Windows service.</param>
        public CustomWebHostService(IWebHost host)
        {
            _host = host ?? throw new ArgumentNullException(nameof(host));
        }

        /// <summary>
        /// This method is not intended for direct use. Its sole purpose is to allow
        /// the service to be started by the tests.
        /// </summary>
        internal void Start() => OnStart(Array.Empty<string>());

        protected sealed override void OnStart(string[] args)
        {
            if (!cts.IsCancellationRequested)
            {
                cts.Cancel();
            }

            cts = new CancellationTokenSource();

            OnStarting(args);

            Task.Run(async () =>
            {
                try
                {
                    await _host.StartAsync(cts.Token);
                    // Register callback for application stopping after we've
                    // started the service, because otherwise we might introduce unwanted
                    // race conditions.
                    _host
                        .Services
                        .GetRequiredService<IHostApplicationLifetime>()
                        .ApplicationStopping
                        .Register(() =>
                        {
                            if (!_stopRequestedByWindows)
                            {
                                Stop();
                            }
                        });
                }
                catch
                {
                    OnStop();
                }
            }, cts.Token);

            OnStarted();
        }

        protected sealed override void OnStop()
        {
            _stopRequestedByWindows = true;
            OnStopping();
            Task.Run(async () =>
                {
                    try
                    {
                        cts.Cancel();
                        await _host.StopAsync();
                    }
                    finally
                    {
                        _host.Dispose();
                        OnStopped();
                    }
                });
        }

        /// <summary>
        /// Executes before ASP.NET Core starts.
        /// </summary>
        /// <param name="args">The command line arguments passed to the service.</param>
        protected virtual void OnStarting(string[] args) { }

        /// <summary>
        /// Executes after ASP.NET Core starts.
        /// </summary>
        protected virtual void OnStarted() { }

        /// <summary>
        /// Executes before ASP.NET Core shuts down.
        /// </summary>
        protected virtual void OnStopping() { }

        /// <summary>
        /// Executes after ASP.NET Core shuts down.
        /// </summary>
        protected virtual void OnStopped() { }
    }
}
