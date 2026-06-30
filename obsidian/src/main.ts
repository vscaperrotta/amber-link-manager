import { Plugin } from "obsidian";
import { VIEW_TYPE, NAME, FOLDER, PLUGIN_ICON } from "./constants";
import pluginView from "./views/pluginView";
import LibrarySettingTab from "./settings/settingsTab";

type MainPluginData = {
  localJsonPath?: string;
  viewMode?: "grid" | "list";
  libraryFolder?: string;
  open?: boolean;
};

export default class MainPlugin extends Plugin {
  localJsonPath: string | null = null;
  viewMode: "grid" | "list" = "grid";
  libraryFolder: string = FOLDER;

  async onload() {
    await this.loadPluginData();

    this.addSettingTab(new LibrarySettingTab(this.app, this));

    this.registerView(
      VIEW_TYPE,
      (leaf) => new pluginView(leaf, this)
    );

    this.addRibbonIcon(PLUGIN_ICON, NAME, async () => {
      await this.openNewTab();
    });
  }

  onunload() { }

  private async loadPluginData() {
    const data = (await this.loadData()) as MainPluginData | null;
    this.localJsonPath = data?.localJsonPath ?? null;
    this.viewMode = (data?.viewMode === "list") ? "list" : "grid";
    this.libraryFolder = data?.libraryFolder ?? FOLDER;
  }

  async setViewMode(viewMode: "grid" | "list") {
    this.viewMode = viewMode;
    await this.savePluginData();
  }

  private async savePluginData() {
    const data: MainPluginData = {
      viewMode: this.viewMode,
      libraryFolder: this.libraryFolder,
    };
    if (this.localJsonPath) data.localJsonPath = this.localJsonPath;
    await this.saveData(data);
  }

  async setLocalJsonPath(path: string | null) {
    this.localJsonPath = path;
    await this.savePluginData();
  }

  async setLibraryFolder(folder: string) {
    this.libraryFolder = folder;
    await this.savePluginData();
  }

  private async openNewTab() {
    const existingLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existingLeaves.length > 0) {
      this.app.workspace.revealLeaf(existingLeaves[0]);
      return;
    }

    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
  }
}
