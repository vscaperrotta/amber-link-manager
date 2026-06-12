export default function renderTextarea(container: HTMLElement, placeholder: string) {
  const field = container.createDiv({
    cls: "obs-amber-input-field"
  });
  const input = field.createEl(
    "textarea",
    {
      placeholder: placeholder,
    }
  );

  return input;
}
