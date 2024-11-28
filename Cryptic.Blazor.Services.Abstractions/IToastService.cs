

namespace Cryptic.Blazor.Services.Abstractions;

public interface IToastService
{
    event Func<string, string, int, Task>? OnShowToast;

    Task ShowToast(string title, string message, int delay);
}

