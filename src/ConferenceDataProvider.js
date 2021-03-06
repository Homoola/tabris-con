/*globals Promise: true*/
import * as persistedStorage from "./persistedStorage";
import * as alert from "./components/alert";
import config from "./configs/config";
import * as ConferenceDataFactory from "./ConferenceDataFactory";
import texts from "./resources/texts";

export default class {
  constructor(bundledConferenceData) {
    this._bundledConferenceData = bundledConferenceData;
  }

  setNewDataFetcher(newDataFetcher) {
    this._newDataFetcher = newDataFetcher;
  }

  get() {
    this._handleWindows();

    if (this._conferenceData) {
      return Promise.resolve(this._conferenceData);
    }

    this._handleAppUpgrade();

    if (!config.SERVICE_URL) {
      return this._useBundledData();
    }

    return this._newDataFetcher.fetch()
      .then(rawData => {
        if (rawData) {
          let conferenceData = ConferenceDataFactory.createFromRawData(config, rawData);
          persistedStorage.setConferenceData(conferenceData);
        } else {
          this._fallBackToPresentData({fetchFailed: false});
        }
      })
      .catch(e => {
        console.log(e);
        console.log(e.stack);
        this._fallBackToPresentData({fetchFailed: true});
      })
      .then(() => {
        this._conferenceData = persistedStorage.getConferenceData();
        return this._conferenceData;
      });
  }

  _useBundledData() {
    persistedStorage.setConferenceData(this._bundledConferenceData);
    this._conferenceData = persistedStorage.getConferenceData();
    return Promise.resolve(this._conferenceData);
  }

  invalidateCache() {
    this._conferenceData = null;
  }

  _handleWindows() {
    if (device.platform === "windows") {
      if (!this._conferenceData) {
        this._conferenceData = this._bundledConferenceData;
      }
    }
  }

  _handleAppUpgrade() {
    let currentVersion = tabris._client.get("tabris.App", "version");
    let appVersion = localStorage.getItem("appVersion");
    if (currentVersion !== appVersion && device.platform !== "windows") { // TODO: also handle on Windows when client supports app version
      persistedStorage.removeConferenceData();
    }
    localStorage.setItem("appVersion", currentVersion);
  }

  _fallBackToPresentData(options) {
    let dataStored = persistedStorage.conferenceDataStored();
    if (options.fetchFailed || !dataStored) {
      alert.show(this._dataMayBeOutdatedMessage(), texts.DIALOG_WARNING, texts.DIALOG_OK);
    }
    if (!dataStored) {
      persistedStorage.setConferenceData(this._bundledConferenceData);
    }
  }

  _dataMayBeOutdatedMessage() {
    return texts.DATA_MAY_BE_OUTDATED_MESSAGE;
  }

}
