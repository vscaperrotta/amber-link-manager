export default function renderTextField(container: HTMLElement, label: string, value: string) {

  const field = container.createDiv({
    cls: "obs-amber-text-field"
  });

  field.createEl("label", {
    text: label,
  });

  field.createEl("p", {
    text: value
  });

  return field;
}
