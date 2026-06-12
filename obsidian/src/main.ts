import { Plugin } from "obsidian";
import { VIEW_TYPE, NAME, FOLDER, PLUGIN_ICON } from "./constants";
import pluginView from "./views/pluginView";
import LibrarySettingTab from "./settings/settingsTab";

type MainPluginData = {
  localJsonPath?: string;
  omdbApiKey?: string;
  viewMode?: "grid" | "list";
  libraryFolder?: string;
  open?: boolean;
  openrouterApiKey?: string;
  openrouterModel?: string;
};

export default class MainPlugin extends Plugin {
  localJsonPath: string | null = null;
  omdbApiKey: string = "";
  viewMode: "grid" | "list" = "grid";
  libraryFolder: string = FOLDER;
  openrouterApiKey: string = "";
  openrouterModel: string = "meta-llama/llama-3.2-3b-instruct:free";

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
    this.omdbApiKey = data?.omdbApiKey ?? "";
    this.viewMode = (data?.viewMode === "list") ? "list" : "grid";
    this.libraryFolder = data?.libraryFolder ?? FOLDER;
    this.openrouterApiKey = data?.openrouterApiKey ?? "";
    this.openrouterModel = data?.openrouterModel ?? "meta-llama/llama-3.2-3b-instruct:free";
  }

  async setOmdbApiKey(apiKey: string) {
    this.omdbApiKey = apiKey;
    await this.savePluginData();
  }

  async setViewMode(viewMode: "grid" | "list") {
    this.viewMode = viewMode;
    await this.savePluginData();
  }

  private async savePluginData() {
    const data: MainPluginData = {
      omdbApiKey: this.omdbApiKey,
      viewMode: this.viewMode,
      libraryFolder: this.libraryFolder,
      openrouterApiKey: this.openrouterApiKey,
      openrouterModel: this.openrouterModel,
    };
    if (this.localJsonPath) data.localJsonPath = this.localJsonPath;
    await this.saveData(data);
  }

  async setOpenRouterApiKey(key: string) {
    this.openrouterApiKey = key;
    await this.savePluginData();
  }

  async setOpenRouterModel(model: string) {
    this.openrouterModel = model;
    await this.savePluginData();
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
