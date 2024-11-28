namespace Cryptic.Blazor.Model;

public class ModalContent
{
    public string Title { get; }

    public string Content { get; }

    public string? Infotext { get; }

    public InfotextType InfotextStyle { get; init; }

    public string? Icon { get; init; }

    public bool DisableCopy { get; set; }

    public ModalContent(string title, string content, string? warning)
    {
        Title = title;
        Content = content;
        Infotext = warning;
        InfotextStyle = InfotextType.INFO;
    }
}

