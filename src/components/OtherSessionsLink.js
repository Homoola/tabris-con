import ConfigurationDate from "../ConfigurationDate";
import getSessionFreeBlock from "../getSessionFreeBlock";
import config from "../config";
import Link from "./Link";
import sizes from "../resources/sizes";
import SessionsPage from "../pages/SessionsPage";
import {Composite} from "tabris";

export default class extends Composite {
  constructor(viewDataProvider) {
    super();
    this.on("change:data", (widget, session) => {
      let freeBlock = getSessionFreeBlock(session, config);
      if (freeBlock) {
        let date1 = new ConfigurationDate(config, freeBlock[0]);
        let date2 = new ConfigurationDate(config, freeBlock[1]);
        viewDataProvider.getOtherSessionsInTimeframe(date1, date2, session.id)
          .then(otherSessions => {
            if (otherSessions.length > 0) {
              this._createOtherSessionsLink()
                .on("tap", () => {
                  let sessionsPage = new SessionsPage(viewDataProvider).open();
                  let from = date1.format("LT");
                  let to = date2.format("LT");
                  sessionsPage.set("data", {title: from + " - " + to, items: otherSessions});
                })
                .appendTo(this);
            }
          });
      }
    });

  }

  _createOtherSessionsLink() {
    return new Link({
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#speakersComposite", sizes.MARGIN_LARGE],
      height: sizes.SESSION_PAGE_OTHER_SESSIONS_LINK_HEIGHT,
      text: "Other sessions at the same time"
    });
  }
}
