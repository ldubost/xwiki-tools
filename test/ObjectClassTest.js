var XWiki = require('../index');
var XMHell = require('xmhell');
var Fs = require('fs');
var path = __dirname+'/samples';

// Make sure that parsing and re-serializing a class yields the same json.
var mkTest = function(xml) {
  exports['test_'+xml] = function(test, assert) {
    Fs.readFile(path + "/" + xml, 'utf8', function(err, content) {
      if (err) { throw err; }
      var json = XMHell.parse(content);

      var out;
      var js = XWiki.tools.ClassParser.parse(content);
      var func = new Function("var define = arguments[0]; " + js);
      func(function(x,y) { out = y; });
      var XObject = out(XWiki);

      var obj = new XObject();
      var cc = obj.json['class'];
      var c = json.xwikidoc['class'];
      //console.log(JSON.stringify(cc, null, '  '));
      //console.log(JSON.stringify(c, null, '  '));
      assert.deepEqual(cc, c);
      test.finish();
    });
  };
};

Fs.readdirSync(path).forEach(function(xml) {
  mkTest(xml);
});
