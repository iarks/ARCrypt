using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArCrypt.Blazor.Model;

public class ModalContent
{
    public string Title { get; }

    public string Content { get; }

    public string? Warning { get; }

    public string? Icon { get; init; }

    public ModalContent(string title, string content, string? warning)
    {
        Title = title;
        Content = content;
        Warning = warning;
    }
}

