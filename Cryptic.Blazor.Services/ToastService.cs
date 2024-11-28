using Cryptic.Blazor.Services.Abstractions;

namespace Cryptic.Blazor.Services;

internal class ToastService: IToastService
{
    public event Func<string, string, int, Task>? OnShowToast;

    public Task ShowToast(string title, string message, int delay)
    {
        return OnShowToast?.Invoke(title, message, delay) ?? Task.CompletedTask;
    }
}

