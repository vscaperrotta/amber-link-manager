import { App, PluginSettingTab, Setting, Notice, TFile } from "obsidian";
import pluginView from "../views/pluginView";
import { NAME, VIEW_TYPE, REPOSITORY_URL } from "../constants";
import MainPlugin from "../main";
import { createDefaultData, createJsonFile, getDefaultPath, getFolder, saveLocalData } from "../services/storage";
import { t } from "../utils/i18n";
export default class LibrarySettingTab extends PluginSettingTab {
  plugin: MainPlugin;

  constructor(app: App, plugin: MainPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    // Configuration
    new Setting(containerEl)
      .setName(t('settings.configHeading'))
      .setHeading();

    new Setting(containerEl)
      .setName(t('settings.libraryFolder'))
      .setDesc(t('settings.libraryFolderDesc'))
      .addText(text => text
        .setPlaceholder(t('settings.folderPlaceholder'))
        .setValue(this.plugin.libraryFolder)
        .onChange(async (value) => {
          const folder = value.trim() || NAME;
          await this.plugin.setLibraryFolder(folder);
        }));

    // External library support removed.

    new Setting(containerEl)
      .setName(t('settings.linkedLibrary'))
      .setDesc(
        this.plugin.localJsonPath
          ? t('settings.linkedLibraryDesc', { path: this.plugin.localJsonPath })
          : t('settings.noLinkedLibrary')
      )
      .addDropdown(drop => {
        const files = this.app.vault.getFiles().filter((f) => f.extension === "json");
        const options: Record<string, string> = { "": t('settings.noneOption') };
        files.forEach((f) => (options[f.path] = f.path));
        drop.addOptions(options).setValue(this.plugin.localJsonPath ?? "").onChange(async (value) => {
          const path = value || null;
          await this.plugin.setLocalJsonPath(path);
          await this.refreshOpenViews();
          this.display();
        });
      })
      .addButton(button => button
        .setButtonText(t('settings.unlinkLocal'))
        .setDisabled(!this.plugin.localJsonPath)
        .onClick(async () => {
          await this.plugin.setLocalJsonPath(null);
          await this.refreshOpenViews();
          this.display();
        }));

    new Setting(containerEl)
      .setName(t('settings.createNewLibrary'))
      .setDesc(t('settings.createNewLibraryDesc'))
      .addButton(button => button
        .setButtonText(t('settings.createLibraryBtn'))
        .onClick(async () => {
          await this.createNewLibrary();
        }));

    new Setting(containerEl)
      .setName(t('settings.exportLibrary'))
      .setDesc(t('settings.exportLibraryDesc'))
      .addButton(button => button
        .setButtonText(t('settings.exportJsonBtn'))
        .onClick(async () => {
          await this.exportLibraryJson();
        }));

    // Bugfix
    new Setting(containerEl).setName(t('settings.bugfixHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('settings.reportIssues'))
      .setDesc(t('settings.reportIssuesDesc', { name: NAME }))
      .addButton(button => button
        .setButtonText(t('settings.githubBtn'))
        .onClick(() => {
          window.open(`${REPOSITORY_URL}/issues`, "_blank");
        }));

    // Support and donation
    new Setting(containerEl).setName(t('settings.supportHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('settings.donate'))
      .setDesc(t('settings.donateDesc'))
      .addButton((bt) => {
        bt.buttonEl.outerHTML =
          "<a href='https://ko-fi.com/T6T01TX807' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>";
      });
  }

  private async exportLibraryJson() {
    try {
      const content = await this.getLibraryJsonContent();
      if (!content) {
        new Notice(t('settings.noLibraryFound'));
        return;
      }

      // Create export file inside vault for mobile compatibility
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const exportPath = `library-export-${timestamp}.json`;

      // Check if file exists, if so add a counter
      let finalPath = exportPath;
      let counter = 1;
      while (this.app.vault.getAbstractFileByPath(finalPath)) {
        finalPath = `library-export-${timestamp}-${counter}.json`;
        counter++;
      }

      await this.app.vault.create(finalPath, content);
      new Notice(t('settings.libraryExported', { path: finalPath }));
    } catch (error) {
      console.error(`[${NAME}] Export library error`, error);
      new Notice(t('settings.errorExportLibrary'));
    }
  }

  private async createNewLibrary() {
    const confirmed = window.confirm(t('settings.confirmCreateLibrary'));
    if (!confirmed) return;

    try {
      const defaultFile = this.app.vault.getAbstractFileByPath(getDefaultPath(this.plugin.libraryFolder));
      let createdFile: TFile | undefined;
      if (defaultFile instanceof TFile) {
        await saveLocalData(this.app, defaultFile, createDefaultData());
        createdFile = defaultFile;
      } else {
        createdFile = await createJsonFile(this.app, this.plugin.libraryFolder);
      }

      if (createdFile) {
        await this.plugin.setLocalJsonPath(createdFile.path);
      }
      await this.refreshOpenViews();
      this.display();
      new Notice(t('settings.newLibraryCreated'));
    } catch (error) {
      console.error(`[${NAME}] Create new library error`, error);
      new Notice(t('settings.errorCreateLibrary'));
    }
  }

  private async getLibraryJsonContent(): Promise<string | null> {
    // Prefer a local linked file inside the vault
    if (this.plugin.localJsonPath) {
      const localPath = this.plugin.localJsonPath;
      const file = this.app.vault.getAbstractFileByPath(localPath);
      if (file instanceof TFile) {
        return this.app.vault.read(file);
      }
    }

    const defaultFile = this.app.vault.getAbstractFileByPath(getDefaultPath(this.plugin.libraryFolder));
    if (defaultFile instanceof TFile) {
      return this.app.vault.read(defaultFile);
    }

    const folder = getFolder(this.plugin.libraryFolder);
    const fallback = this.app.vault
      .getFiles()
      .find((file) => file.extension === "json" && file.path.startsWith(`${folder}/`));

    if (fallback) {
      return this.app.vault.read(fallback);
    }

    return null;
  }

  private async refreshOpenViews() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    for (const leaf of leaves) {
      if (leaf.view instanceof pluginView) {
        await leaf.view.onOpen();
      }
    }
  }

}
