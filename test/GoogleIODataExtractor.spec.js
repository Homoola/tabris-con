var expect = require("chai").expect;
var GoogleIODataExtractor = require("../src/data/GoogleIODataExtractor");
var IO_CONFERENCE_DATA = require("./data/googleIO/ioConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/googleIO/previewCategories.json");
var PLAY_CATEGORY = require("./data/googleIO/playCategory.json");
var SESSION = require("./data/googleIO/session.json");
var BLOCKS = require("./data/googleIO/blocks.json");

describe("googleIODataExtractor", function() {

  var googleIODataExtractor;

  before(function() {
    googleIODataExtractor = new GoogleIODataExtractor(IO_CONFERENCE_DATA);
  });

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = googleIODataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategory", function() {
    it("extracts category for a given tag", function() {
      var playCategory = googleIODataExtractor.extractCategory("TOPIC_PLAY");

      expect(playCategory).to.deep.equal(PLAY_CATEGORY);
    });
  });

  describe("extractSession", function() {
    it("extracts a session for a given ID", function() {
      var session = googleIODataExtractor.extractSession("ee58a197-b6d4-e411-b87f-00155d5066d7");

      expect(session).to.deep.equal(SESSION);
    });
  });

  describe("extractBlocks", function() {
    it("extracts conference blocks", function() {
      var blocks = googleIODataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});
