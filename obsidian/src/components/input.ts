export type Config = {
  type?: string;
  placeholder?: string;
  value?: string;
};

export default function renderInput(container: HTMLElement, config: Config) {
  const field = container.createDiv({
    cls: "obs-amber-input-field"
  });
  const input = field.createEl(
    "input",
    {
      type: "text",
      ...config
    }
  );

  return input;
}
