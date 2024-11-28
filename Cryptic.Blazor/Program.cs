using Cryptic.Blazor.Model.Validation;
using Cryptic.Blazor.Services;
using Cryptic.Blazor.Services.Abstractions;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace Cryptic.Blazor;
public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddSingleton<ICryptoService, CryptoService>();
        builder.Services.AddScoped<IToastService, ToastService>();
        builder.Services.AddSingleton<EncryptionFormValidator>();
        builder.Services.AddSingleton<DecryptionFormValidator>();


        var host = builder.Build();
        await host.Services.GetRequiredService<ICryptoService>().Initialise();


        await host.RunAsync();
    }
}

