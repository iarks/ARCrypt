using ArCrypt.Blazor.Services;
using ArCrypt.Blazor.Services.Abstractions;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;

namespace ArCrypt.Blazor
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");
            builder.RootComponents.Add<HeadOutlet>("head::after");

            builder.Services.AddScoped<ICryptoService, CryptoService>();
            builder.Services.AddScoped<IToastService, ToastService>();
            builder.Services.AddMudServices();

            await builder.Build().RunAsync();
        }
    }
}
